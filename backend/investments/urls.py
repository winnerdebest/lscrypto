from django.urls import path
from .views import AITradingTierListView, BotDeploymentListView, TradeExecutionLogListView

urlpatterns = [
    path('tiers/', AITradingTierListView.as_view(), name='tier-list'),
    path('deployments/', BotDeploymentListView.as_view(), name='my-deployments'),
    path('live-trades/', TradeExecutionLogListView.as_view(), name='live-trades'),
]
