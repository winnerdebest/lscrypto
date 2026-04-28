from django.db import models
from django.conf import settings

class InvestmentPlan(models.Model):
    name = models.CharField(max_length=100)
    roi_percentage = models.DecimalField(max_digits=5, decimal_places=2, help_text="Daily ROI percentage")
    duration_days = models.PositiveIntegerField()
    minimum_amount = models.DecimalField(max_digits=20, decimal_places=8)

    def __str__(self):
        return f"{self.name} - {self.roi_percentage}% for {self.duration_days} days"

class UserInvestment(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('completed', 'Completed'),
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='investments')
    plan = models.ForeignKey(InvestmentPlan, on_delete=models.SET_NULL, null=True, related_name='user_investments')
    amount = models.DecimalField(max_digits=20, decimal_places=8, help_text="Amount in the actual coin")
    amount_usd = models.DecimalField(max_digits=20, decimal_places=2, default=0.0, help_text="USD value at time of investment")
    coin = models.CharField(max_length=10)
    start_date = models.DateTimeField(auto_now_add=True)
    expected_return = models.DecimalField(max_digits=20, decimal_places=8)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')

    def __str__(self):
        return f"{self.user.username} - {self.plan.name if self.plan else 'Unknown Plan'} ({self.amount} {self.coin})"
