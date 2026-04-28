from celery import shared_task
from django.utils import timezone
from decimal import Decimal
from .models import UserInvestment
from accounts.models import Balance
from payments.models import Transaction

@shared_task
def process_daily_roi():
    active_investments = UserInvestment.objects.filter(status='active')
    
    for investment in active_investments:
        plan = investment.plan
        if not plan:
            continue
            
        daily_roi = investment.amount * plan.roi_percentage / Decimal('100')
        
        balance, created = Balance.objects.get_or_create(
            user=investment.user,
            coin=investment.coin,
            defaults={'amount': Decimal('0.0')}
        )
        balance.amount += daily_roi
        balance.save()
        
        Transaction.objects.create(
            user=investment.user,
            transaction_type='roi',
            coin=investment.coin,
            amount=daily_roi,
            status='completed'
        )
        
        days_passed = (timezone.now() - investment.start_date).days
        if days_passed >= plan.duration_days:
            investment.status = 'completed'
            investment.save()
            
            # Return capital
            balance.amount += investment.amount
            balance.save()
            
            Transaction.objects.create(
                user=investment.user,
                transaction_type='roi', # Using roi as type for capital return to fit existing choices
                coin=investment.coin,
                amount=investment.amount,
                status='completed'
            )
