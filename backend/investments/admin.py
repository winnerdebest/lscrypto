from django.contrib import admin
from .models import InvestmentPlan, UserInvestment

@admin.register(InvestmentPlan)
class InvestmentPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'roi_percentage', 'duration_days', 'minimum_amount')

@admin.register(UserInvestment)
class UserInvestmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan', 'amount', 'coin', 'expected_return', 'status', 'start_date')
    list_filter = ('status', 'plan', 'coin')
    search_fields = ('user__email', 'user__username')
