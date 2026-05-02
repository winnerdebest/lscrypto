from rest_framework import serializers
from django.contrib.auth import get_user_model
from payments.models import Transaction, Withdrawal
from investments.models import BotDeployment, AITradingTier

User = get_user_model()

class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'kyc_status', 'date_joined', 'is_active', 'is_staff']

class TransactionSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'user_email', 'user_username', 'transaction_type', 'coin', 'amount', 'status', 'nowpayments_payment_id', 'created_at']

class WithdrawalSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Withdrawal
        fields = ['id', 'user', 'user_email', 'user_username', 'coin', 'amount', 'wallet_address', 'status', 'created_at']

class BotDeploymentSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    tier_name = serializers.CharField(source='tier.name', read_only=True)
    
    class Meta:
        model = BotDeployment
        fields = ['id', 'user', 'user_email', 'user_username', 'tier', 'tier_name', 'amount', 'coin', 'start_date', 'status']

class AITradingTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = AITradingTier
        fields = ['id', 'name', 'target_apy_range', 'max_portfolio_size', 'minimum_amount']

class AdminStatsSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    total_deposits = serializers.DecimalField(max_digits=20, decimal_places=2)
    total_withdrawals = serializers.DecimalField(max_digits=20, decimal_places=2)
    pending_withdrawals = serializers.IntegerField()
    pending_kyc = serializers.IntegerField()
    active_investments = serializers.IntegerField()