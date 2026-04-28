from django.contrib import admin
from django.contrib import messages
from .models import Transaction, Withdrawal, PlatformWallet
from accounts.models import Balance

@admin.register(PlatformWallet)
class PlatformWalletAdmin(admin.ModelAdmin):
    list_display = ('coin', 'address', 'is_active', 'updated_at')
    list_editable = ('address', 'is_active')

from .utils import get_live_price

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'transaction_type', 'coin', 'amount', 'status', 'created_at')
    list_filter = ('status', 'transaction_type', 'coin')
    search_fields = ('user__username', 'user__email', 'nowpayments_payment_id')
    actions = ['approve_deposits']

    def save_model(self, request, obj, form, change):
        if change:
            old_obj = Transaction.objects.get(pk=obj.pk)
            # If status is being changed to completed
            if old_obj.status != 'completed' and obj.status == 'completed':
                if obj.transaction_type == 'deposit':
                    # If we already have a USD value (new system), use the pre-calculated amount
                    if obj.amount_usd > 0:
                        crypto_amount = float(obj.amount)
                    else:
                        # Old system: amount was USD, so convert it
                        rate = get_live_price(obj.coin.upper())
                        crypto_amount = float(obj.amount) / rate
                    
                    balance, _ = Balance.objects.get_or_create(
                        user=obj.user,
                        coin=obj.coin.upper(),
                        defaults={'amount': 0}
                    )
                    balance.amount = float(balance.amount) + crypto_amount
                    balance.save()
                    messages.success(request, f"Credited {crypto_amount:.8f} {obj.coin.upper()} to {obj.user.email}")
        
        obj.coin = obj.coin.upper() # Ensure coin is always uppercase
        super().save_model(request, obj, form, change)

    @admin.action(description='Approve selected deposits')
    def approve_deposits(self, request, queryset):
        deposits = queryset.filter(transaction_type='deposit', status='pending')
        
        count = 0
        for deposit in deposits:
            self._process_approval(deposit)
            count += 1
            
        self.message_user(request, f"Successfully approved {count} deposit(s).", messages.SUCCESS)

    def _process_approval(self, deposit):
        if deposit.status != 'completed':
            if deposit.amount_usd > 0:
                crypto_amount = float(deposit.amount)
            else:
                rate = get_live_price(deposit.coin.upper())
                crypto_amount = float(deposit.amount) / rate

            deposit.status = 'completed'
            deposit.coin = deposit.coin.upper()
            deposit.save()
            
            balance, _ = Balance.objects.get_or_create(
                user=deposit.user,
                coin=deposit.coin,
                defaults={'amount': 0}
            )
            balance.amount = float(balance.amount) + crypto_amount
            balance.save()

@admin.register(Withdrawal)
class WithdrawalAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'coin', 'amount', 'wallet_address', 'status', 'created_at')
    list_filter = ('status', 'coin')
    search_fields = ('user__username', 'wallet_address')
    actions = ['mark_completed', 'reject_and_refund']

    @admin.action(description='Mark selected as Completed')
    def mark_completed(self, request, queryset):
        count = queryset.update(status='completed')
        self.message_user(request, f"Successfully marked {count} withdrawal(s) as completed.", messages.SUCCESS)

    @admin.action(description='Reject and Refund selected')
    def reject_and_refund(self, request, queryset):
        pending_withdrawals = queryset.filter(status__in=['pending', 'processing'])
        count = 0
        for w in pending_withdrawals:
            w.status = 'rejected'
            w.save()
            
            balance, _ = Balance.objects.get_or_create(
                user=w.user,
                coin=w.coin,
                defaults={'amount': 0}
            )
            balance.amount += w.amount
            balance.save()
            count += 1
            
        self.message_user(request, f"Rejected and refunded {count} withdrawal(s).", messages.SUCCESS)
