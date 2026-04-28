from rest_framework import serializers
from django.contrib.auth import get_user_model
from payments.models import Transaction, Withdrawal
from investments.models import UserInvestment, InvestmentPlan

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

class UserInvestmentSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    plan_name = serializers.CharField(source='plan.name', read_only=True)
    
    class Meta:
        model = UserInvestment
        fields = ['id', 'user', 'user_email', 'user_username', 'plan', 'plan_name', 'amount', 'coin', 'start_date', 'expected_return', 'status']

class InvestmentPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvestmentPlan
        fields = ['id', 'name', 'roi_percentage', 'duration_days', 'minimum_amount']

class AdminStatsSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    total_deposits = serializers.DecimalField(max_digits=20, decimal_places=2)
    total_withdrawals = serializers.DecimalField(max_digits=20, decimal_places=2)
    pending_withdrawals = serializers.IntegerField()
    pending_kyc = serializers.IntegerField()
    active_investments = serializers.IntegerField()