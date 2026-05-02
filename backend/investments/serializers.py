from rest_framework import serializers
from .models import AITradingTier, BotDeployment, TradeExecutionLog

class AITradingTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = AITradingTier
        fields = '__all__'

class BotDeploymentSerializer(serializers.ModelSerializer):
    tier_details = AITradingTierSerializer(source='tier', read_only=True)

    class Meta:
        model = BotDeployment
        fields = ['id', 'tier', 'tier_details', 'amount', 'amount_usd', 'coin', 'start_date', 'status']
        read_only_fields = ['status', 'start_date']

class TradeExecutionLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TradeExecutionLog
        fields = '__all__'
