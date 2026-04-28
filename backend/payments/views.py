from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from .models import Transaction, Withdrawal, PlatformWallet
from accounts.models import Balance
from .serializers import TransactionSerializer, WithdrawalSerializer, DepositRequestSerializer
import requests
import hmac
import hashlib
import json
import uuid
from .utils import get_live_price
from decimal import Decimal

class DepositView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        serializer = DepositRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        amount = serializer.validated_data['amount']
        coin = serializer.validated_data['coin'].upper()

        try:
            wallet = PlatformWallet.objects.get(coin=coin, is_active=True)
            pay_address = wallet.address
        except PlatformWallet.DoesNotExist:
            return Response({'detail': f'Deposit address for {coin} is currently unavailable.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Fetch Live Rate
        rate = get_live_price(coin)
        crypto_amount = float(amount) / rate

        transaction = Transaction.objects.create(
            user=request.user,
            transaction_type='deposit',
            coin=coin,
            amount=crypto_amount, # Actual crypto amount
            amount_usd=amount,    # USD value
            status='pending',
            nowpayments_payment_id=f"dp_{uuid.uuid4().hex[:12]}"
        )
        
        data = {
            'pay_amount': round(crypto_amount, 6),
            'pay_currency': coin,
            'pay_address': pay_address,
            'payment_id': transaction.nowpayments_payment_id
        }
        
        return Response(data, status=status.HTTP_201_CREATED)

class NOWPaymentsWebhookView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        ipn_secret = settings.NOWPAYMENTS_IPN_SECRET
        sig = request.headers.get('x-nowpayments-sig')
        
        if not sig or not ipn_secret:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        request_data = request.body
        sorted_dict = json.dumps(json.loads(request_data), separators=(',', ':'), sort_keys=True)
        
        hmac_obj = hmac.new(
            ipn_secret.encode('utf-8'),
            sorted_dict.encode('utf-8'),
            hashlib.sha512
        )
        signature = hmac_obj.hexdigest()

        if signature != sig:
            return Response({'detail': 'Invalid signature'}, status=status.HTTP_400_BAD_REQUEST)

        data = request.data
        payment_id = str(data.get('payment_id'))
        payment_status = data.get('payment_status')

        try:
            transaction = Transaction.objects.get(nowpayments_payment_id=payment_id)
            
            if payment_status == 'finished' and transaction.status != 'completed':
                transaction.status = 'completed'
                transaction.save()
                
                balance, _ = Balance.objects.get_or_create(
                    user=transaction.user,
                    coin=transaction.coin,
                    defaults={'amount': 0}
                )
                balance.amount += transaction.amount
                balance.save()
                
            elif payment_status in ['failed', 'expired', 'refunded']:
                transaction.status = 'failed'
                transaction.save()

            return Response(status=status.HTTP_200_OK)
        except Transaction.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class WithdrawalRequestView(generics.CreateAPIView):
    serializer_class = WithdrawalSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        amount = serializer.validated_data['amount']
        coin = serializer.validated_data['coin']
        
        try:
            balance = Balance.objects.get(user=request.user, coin=coin)
            if balance.amount < amount:
                return Response({'detail': 'Insufficient balance'}, status=status.HTTP_400_BAD_REQUEST)
        except Balance.DoesNotExist:
            return Response({'detail': 'Balance not found for this coin'}, status=status.HTTP_400_BAD_REQUEST)

        balance.amount -= amount
        balance.save()

        withdrawal = Withdrawal.objects.create(
            user=request.user,
            coin=coin,
            amount=amount,
            wallet_address=serializer.validated_data['wallet_address']
        )
        
        Transaction.objects.create(
            user=request.user,
            transaction_type='withdrawal',
            coin=coin,
            amount=amount,
            status='pending'
        )

        headers = self.get_success_headers(serializer.data)
        return Response(WithdrawalSerializer(withdrawal).data, status=status.HTTP_201_CREATED, headers=headers)

class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by('-created_at')

class SwapView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        from_coin = request.data.get('from_coin', '').upper()
        to_coin = request.data.get('to_coin', '').upper()
        amount = Decimal(str(request.data.get('amount', 0)))

        if not from_coin or not to_coin or amount <= 0:
            return Response({'detail': 'Invalid request parameters'}, status=status.HTTP_400_BAD_REQUEST)

        if from_coin == to_coin:
            return Response({'detail': 'Cannot swap the same coin'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            from_balance = Balance.objects.get(user=request.user, coin=from_coin)
            if from_balance.amount < amount:
                return Response({'detail': f'Insufficient {from_coin} balance'}, status=status.HTTP_400_BAD_REQUEST)
        except Balance.DoesNotExist:
            return Response({'detail': f'No {from_coin} balance found'}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch prices
        try:
            from_price = Decimal(str(get_live_price(from_coin)))
            to_price = Decimal(str(get_live_price(to_coin)))
            
            if from_price <= 0 or to_price <= 0:
                raise ValueError("Invalid price data")
        except Exception:
            return Response({'detail': 'Failed to fetch current market rates. Please try again later.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        # Calculate swap
        amount_to_receive = (amount * from_price) / to_price

        # Execute Swap
        from_balance.amount -= amount
        from_balance.save()

        to_balance, _ = Balance.objects.get_or_create(user=request.user, coin=to_coin, defaults={'amount': 0})
        to_balance.amount += amount_to_receive
        to_balance.save()

        # Record Transactions
        Transaction.objects.create(
            user=request.user,
            transaction_type='swap',
            coin=from_coin,
            amount=amount,
            amount_usd=amount * from_price,
            status='completed'
        )
        
        Transaction.objects.create(
            user=request.user,
            transaction_type='swap',
            coin=to_coin,
            amount=amount_to_receive,
            amount_usd=amount * from_price,
            status='completed'
        )

        return Response({
            'detail': f'Successfully swapped {amount:.6f} {from_coin} for {amount_to_receive:.6f} {to_coin}',
            'received_amount': str(amount_to_receive),
            'to_coin': to_coin
        })
