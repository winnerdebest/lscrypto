from rest_framework import serializers
from .models import InvestmentPlan, UserInvestment

class InvestmentPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvestmentPlan
        fields = '__all__'

class UserInvestmentSerializer(serializers.ModelSerializer):
    plan_details = InvestmentPlanSerializer(source='plan', read_only=True)

    class Meta:
        model = UserInvestment
        fields = ['id', 'plan', 'plan_details', 'amount', 'coin', 'start_date', 'expected_return', 'status']
        read_only_fields = ['expected_return', 'status', 'start_date']
