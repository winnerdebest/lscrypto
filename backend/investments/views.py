from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import AITradingTier, BotDeployment, TradeExecutionLog
from .serializers import AITradingTierSerializer, BotDeploymentSerializer, TradeExecutionLogSerializer
from accounts.models import Balance
from decimal import Decimal
from payments.utils import get_live_price

class AITradingTierListView(generics.ListAPIView):
    queryset = AITradingTier.objects.all()
    serializer_class = AITradingTierSerializer
    permission_classes = (permissions.AllowAny,)

class TradeExecutionLogListView(generics.ListAPIView):
    queryset = TradeExecutionLog.objects.all().order_by('-timestamp')[:50]
    serializer_class = TradeExecutionLogSerializer
    permission_classes = (permissions.AllowAny,)

class BotDeploymentListView(generics.ListCreateAPIView):
    serializer_class = BotDeploymentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return BotDeployment.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        tier_id = request.data.get('tier')
        amount_usd = Decimal(str(request.data.get('amount_usd', 0)))
        coin = request.data.get('coin', 'USDT').upper()
        
        try:
            tier = AITradingTier.objects.get(id=tier_id)
        except AITradingTier.DoesNotExist:
            return Response({'detail': 'Tier not found'}, status=status.HTTP_404_NOT_FOUND)
            
        if amount_usd < tier.minimum_amount:
            return Response({'detail': f'Minimum amount is ${tier.minimum_amount}'}, status=status.HTTP_400_BAD_REQUEST)
            
        rate = Decimal(str(get_live_price(coin)))
        crypto_amount = amount_usd / rate

        try:
            balance = Balance.objects.get(user=request.user, coin=coin)
            if balance.amount < crypto_amount:
                return Response({'detail': f'Insufficient {coin} balance. You need {crypto_amount:.8f} {coin}.'}, status=status.HTTP_400_BAD_REQUEST)
        except Balance.DoesNotExist:
            return Response({'detail': f'No {coin} balance found.'}, status=status.HTTP_400_BAD_REQUEST)

        balance.amount -= crypto_amount
        balance.save()

        deployment = BotDeployment.objects.create(
            user=request.user,
            tier=tier,
            amount=crypto_amount,
            amount_usd=amount_usd,
            coin=coin
        )

        return Response(BotDeploymentSerializer(deployment).data, status=status.HTTP_201_CREATED)
