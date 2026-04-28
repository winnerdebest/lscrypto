from django.urls import path
from .views import DepositView, NOWPaymentsWebhookView, WithdrawalRequestView, TransactionListView, SwapView

urlpatterns = [
    path('deposit/', DepositView.as_view(), name='deposit'),
    path('nowpayments-webhook/', NOWPaymentsWebhookView.as_view(), name='webhook'),
    path('withdraw/', WithdrawalRequestView.as_view(), name='withdraw'),
    path('transactions/', TransactionListView.as_view(), name='transactions'),
    path('swap/', SwapView.as_view(), name='swap'),
]
