from django.contrib import admin
from .models import AITradingTier, BotDeployment, TradeExecutionLog, DailyPerformance

@admin.register(AITradingTier)
class AITradingTierAdmin(admin.ModelAdmin):
    list_display = ('name', 'target_apy_range', 'minimum_amount', 'max_portfolio_size')

@admin.register(BotDeployment)
class BotDeploymentAdmin(admin.ModelAdmin):
    list_display = ('user', 'tier', 'amount', 'coin', 'status', 'start_date')
    list_filter = ('status', 'coin', 'tier')

@admin.register(TradeExecutionLog)
class TradeExecutionLogAdmin(admin.ModelAdmin):
    list_display = ('coin_pair', 'action', 'price', 'profit_percentage', 'timestamp')

@admin.register(DailyPerformance)
class DailyPerformanceAdmin(admin.ModelAdmin):
    list_display = ('tier', 'date', 'roi_percentage')
