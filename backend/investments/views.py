from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import InvestmentPlan, UserInvestment
from .serializers import InvestmentPlanSerializer, UserInvestmentSerializer
from accounts.models import Balance
from decimal import Decimal
from payments.utils import get_live_price

class InvestmentPlanListView(generics.ListAPIView):
    queryset = InvestmentPlan.objects.all()
    serializer_class = InvestmentPlanSerializer
    permission_classes = (permissions.AllowAny,)

class UserInvestmentListView(generics.ListCreateAPIView):
    serializer_class = UserInvestmentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return UserInvestment.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        # We expect 'plan' (ID), 'amount_usd' (USD value), and 'coin' (e.g. BTC)
        plan_id = request.data.get('plan')
        amount_usd = Decimal(str(request.data.get('amount_usd', 0)))
        coin = request.data.get('coin', 'USDT').upper()
        
        try:
            plan = InvestmentPlan.objects.get(id=plan_id)
        except InvestmentPlan.DoesNotExist:
            return Response({'detail': 'Plan not found'}, status=status.HTTP_404_NOT_FOUND)
            
        # Validation: check minimum amount (in USD)
        if amount_usd < plan.minimum_amount:
            return Response({'detail': f'Minimum amount is ${plan.minimum_amount}'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Fetch live price to calculate crypto amount
        rate = Decimal(str(get_live_price(coin)))
        crypto_amount = amount_usd / rate

        # Validation: check user balance
        try:
            balance = Balance.objects.get(user=request.user, coin=coin)
            if balance.amount < crypto_amount:
                return Response({'detail': f'Insufficient {coin} balance. You need {crypto_amount:.8f} {coin}.'}, status=status.HTTP_400_BAD_REQUEST)
        except Balance.DoesNotExist:
            return Response({'detail': f'No {coin} balance found.'}, status=status.HTTP_400_BAD_REQUEST)

        # Deduct balance
        balance.amount -= crypto_amount
        balance.save()

        # Calculate expected return in crypto
        total_roi_percentage = plan.roi_percentage * plan.duration_days
        expected_return = crypto_amount + (crypto_amount * total_roi_percentage / Decimal('100'))

        investment = UserInvestment.objects.create(
            user=request.user,
            plan=plan,
            amount=crypto_amount,
            amount_usd=amount_usd,
            coin=coin,
            expected_return=expected_return
        )

        return Response(UserInvestmentSerializer(investment).data, status=status.HTTP_201_CREATED)
