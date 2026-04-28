from django.urls import path
from .views import InvestmentPlanListView, UserInvestmentListView

urlpatterns = [
    path('plans/', InvestmentPlanListView.as_view(), name='plan-list'),
    path('my-investments/', UserInvestmentListView.as_view(), name='my-investments'),
]
