from rest_framework import serializers
from .models import Transaction, Withdrawal

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

class WithdrawalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Withdrawal
        fields = ['id', 'coin', 'amount', 'wallet_address', 'status', 'created_at']
        read_only_fields = ['status', 'created_at']

class DepositRequestSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=20, decimal_places=8)
    coin = serializers.CharField(max_length=10)
