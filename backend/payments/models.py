from django.db import models
from django.conf import settings

class Transaction(models.Model):
    TYPE_CHOICES = (
        ('deposit', 'Deposit'),
        ('withdrawal', 'Withdrawal'),
        ('roi', 'ROI'),
        ('swap', 'Swap'),
    )
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    coin = models.CharField(max_length=10)
    amount = models.DecimalField(max_digits=20, decimal_places=8, help_text="Amount in the actual coin")
    amount_usd = models.DecimalField(max_digits=20, decimal_places=2, default=0.0, help_text="USD value at time of transaction")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    nowpayments_payment_id = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type} of {self.amount} {self.coin} by {self.user.username}"

class Withdrawal(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='withdrawals')
    coin = models.CharField(max_length=10)
    amount = models.DecimalField(max_digits=20, decimal_places=8)
    wallet_address = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Withdrawal {self.amount} {self.coin} to {self.wallet_address}"
class PlatformWallet(models.Model):
    coin = models.CharField(max_length=10, unique=True)
    address = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.coin} - {self.address}"
