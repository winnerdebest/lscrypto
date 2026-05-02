from celery import shared_task
from django.utils import timezone
from decimal import Decimal
import random
from .models import BotDeployment, DailyPerformance, TradeExecutionLog
from accounts.models import Balance
from payments.models import Transaction

@shared_task
def simulate_live_trades():
    # Simulate a trade log every few minutes
    coins = ['PEPE/USDT', 'DOGE/USDT', 'WIF/USDT', 'SHIB/USDT', 'BTC/USDT', 'ETH/USDT', 'SOL/USDT']
    actions = ['BUY', 'SELL']
    
    action = random.choice(actions)
    coin_pair = random.choice(coins)
    
    # Fake a price depending on the coin to be somewhat realistic but not exactly accurate
    price = Decimal(str(random.uniform(0.000001, 100.0)))
    
    profit_percentage = None
    if action == 'SELL':
        profit_percentage = Decimal(str(random.uniform(1.0, 25.0)))
        
    TradeExecutionLog.objects.create(
        coin_pair=coin_pair,
        action=action,
        price=price,
        profit_percentage=profit_percentage
    )

@shared_task
def process_daily_roi():
    active_deployments = BotDeployment.objects.filter(status='active')
    
    for deployment in active_deployments:
        tier = deployment.tier
        if not tier:
            continue
            
        # Get or create today's performance for this tier
        today = timezone.now().date()
        performance, created = DailyPerformance.objects.get_or_create(
            tier=tier,
            date=today,
            defaults={'roi_percentage': Decimal(str(random.uniform(0.5, 3.5)))} # Simulated 0.5% - 3.5% daily
        )
            
        daily_roi = deployment.amount * performance.roi_percentage / Decimal('100')
        
        balance, created = Balance.objects.get_or_create(
            user=deployment.user,
            coin=deployment.coin,
            defaults={'amount': Decimal('0.0')}
        )
        balance.amount += daily_roi
        balance.save()
        
        Transaction.objects.create(
            user=deployment.user,
            transaction_type='roi',
            coin=deployment.coin,
            amount=daily_roi,
            status='completed'
        )
