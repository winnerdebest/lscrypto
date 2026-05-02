from django.db import models
from django.conf import settings

class AITradingTier(models.Model):
    name = models.CharField(max_length=100)
    target_apy_range = models.CharField(max_length=50, help_text="e.g. 150% - 300%")
    max_portfolio_size = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    minimum_amount = models.DecimalField(max_digits=20, decimal_places=8)

    def __str__(self):
        return self.name

class BotDeployment(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('withdrawn', 'Withdrawn'),
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bot_deployments')
    tier = models.ForeignKey(AITradingTier, on_delete=models.SET_NULL, null=True, related_name='deployments')
    amount = models.DecimalField(max_digits=20, decimal_places=8, help_text="Amount in crypto")
    amount_usd = models.DecimalField(max_digits=20, decimal_places=2, default=0.0)
    coin = models.CharField(max_length=10)
    start_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')

    def __str__(self):
        return f"{self.user.username} - {self.tier.name if self.tier else 'Unknown'} ({self.amount} {self.coin})"

class TradeExecutionLog(models.Model):
    coin_pair = models.CharField(max_length=20)
    action = models.CharField(max_length=10) # BUY / SELL
    price = models.DecimalField(max_digits=20, decimal_places=8)
    profit_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.action} {self.coin_pair} at {self.timestamp}"

class DailyPerformance(models.Model):
    tier = models.ForeignKey(AITradingTier, on_delete=models.CASCADE, related_name='daily_performance')
    date = models.DateField(auto_now_add=True)
    roi_percentage = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.tier.name} - {self.date} ({self.roi_percentage}%)"
