from rest_framework import views, permissions
from rest_framework.response import Response
from accounts.models import Balance
from investments.models import BotDeployment
from payments.models import Transaction
from django.db.models import Sum

class DashboardSummaryView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        
        balances = Balance.objects.filter(user=user)
        # Frontend expects: [{ id, coin, balance }, ...]
        balance_data = [{"id": b.id, "coin": b.coin, "balance": str(b.amount)} for b in balances]

        # For simplicity, we just return the count/sum as a single value for now. 
        # In a real app, you'd convert everything to USD.
        total_deposited_val = Transaction.objects.filter(
            user=user, transaction_type='deposit', status='completed'
        ).aggregate(total=Sum('amount_usd'))['total'] or 0

        total_returns_val = Transaction.objects.filter(
            user=user, transaction_type='roi', status='completed'
        ).aggregate(total=Sum('amount'))['total'] or 0

        # Also calculate total ROI specifically for the "Total Earned" stat
        # We can use the same total_returns_val if we assume all 'roi' txns are earnings
        total_roi_val = total_returns_val

        active_deployments = BotDeployment.objects.filter(user=user, status='active')
        active_deployments_count = active_deployments.count()

        return Response({
            'balances': balance_data,
            'total_deposited': str(total_deposited_val),
            'total_returns': str(total_returns_val),
            'total_roi': str(total_roi_val),
            'active_investments_count': active_deployments_count
        })
