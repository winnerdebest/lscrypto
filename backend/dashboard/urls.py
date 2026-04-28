from django.urls import path
from .views import DashboardSummaryView
from .admin_views import (
    AdminStatsView, UserManagementView, UserDetailView, UpdateKycStatusView,
    TransactionManagementView, WithdrawalManagementView, ProcessWithdrawalView,
    InvestmentManagementView, InvestmentPlanView, InvestmentPlanDetailView,
    UserBalancesView, ManualBalanceAdjustmentView
)

urlpatterns = [
    path('summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('admin/users/', UserManagementView.as_view(), name='admin-users'),
    path('admin/users/<int:pk>/', UserDetailView.as_view(), name='admin-user-detail'),
    path('admin/users/<int:user_id>/kyc/', UpdateKycStatusView.as_view(), name='admin-user-kyc'),
    path('admin/users/<int:user_id>/balances/', UserBalancesView.as_view(), name='admin-user-balances'),
    path('admin/users/balance-adjust/', ManualBalanceAdjustmentView.as_view(), name='admin-balance-adjust'),
    path('admin/transactions/', TransactionManagementView.as_view(), name='admin-transactions'),
    path('admin/withdrawals/', WithdrawalManagementView.as_view(), name='admin-withdrawals'),
    path('admin/withdrawals/<int:withdrawal_id>/', ProcessWithdrawalView.as_view(), name='admin-process-withdrawal'),
    path('admin/investments/', InvestmentManagementView.as_view(), name='admin-investments'),
    path('admin/plans/', InvestmentPlanView.as_view(), name='admin-plans'),
    path('admin/plans/<int:pk>/', InvestmentPlanDetailView.as_view(), name='admin-plan-detail'),
]
