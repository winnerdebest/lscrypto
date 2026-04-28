from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.db.models import Sum, Count
from accounts.models import Balance
from payments.models import Transaction, Withdrawal
from investments.models import UserInvestment, InvestmentPlan
from .admin_serializers import (
    UserListSerializer, TransactionSerializer, WithdrawalSerializer,
    UserInvestmentSerializer, InvestmentPlanSerializer, AdminStatsSerializer
)
from accounts.serializers import UserSerializer

User = get_user_model()

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

class AdminStatsView(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request):
        total_users = User.objects.count()
        total_deposits = Transaction.objects.filter(transaction_type='deposit', status='completed').aggregate(total=Sum('amount'))['total'] or 0
        total_withdrawals = Withdrawal.objects.filter(status='completed').aggregate(total=Sum('amount'))['total'] or 0
        pending_withdrawals = Withdrawal.objects.filter(status='pending').count()
        pending_kyc = User.objects.filter(kyc_status='pending').count()
        active_investments = UserInvestment.objects.filter(status='active').count()
        
        return Response({
            'total_users': total_users,
            'total_deposits': str(total_deposits),
            'total_withdrawals': str(total_withdrawals),
            'pending_withdrawals': pending_withdrawals,
            'pending_kyc': pending_kyc,
            'active_investments': active_investments,
        })

class UserManagementView(generics.ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = UserListSerializer
    queryset = User.objects.all().order_by('-date_joined')

class UserDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = UserSerializer
    queryset = User.objects.all()

class UpdateKycStatusView(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def patch(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        kyc_status = request.data.get('kyc_status')
        if kyc_status not in ['unverified', 'pending', 'verified']:
            return Response({'error': 'Invalid KYC status'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.kyc_status = kyc_status
        user.save()
        return Response(UserSerializer(user).data)

class TransactionManagementView(generics.ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = TransactionSerializer
    queryset = Transaction.objects.all().order_by('-created_at')

class WithdrawalManagementView(generics.ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = WithdrawalSerializer
    queryset = Withdrawal.objects.all().order_by('-created_at')

class ProcessWithdrawalView(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def post(self, request, withdrawal_id):
        try:
            withdrawal = Withdrawal.objects.get(id=withdrawal_id)
        except Withdrawal.DoesNotExist:
            return Response({'error': 'Withdrawal not found'}, status=status.HTTP_404_NOT_FOUND)
        
        action = request.data.get('action')
        if action not in ['approve', 'reject']:
            return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
        
        if action == 'approve':
            withdrawal.status = 'processing'
            withdrawal.save()
        elif action == 'reject':
            withdrawal.status = 'rejected'
            withdrawal.save()
            balance = Balance.objects.get(user=withdrawal.user, coin=withdrawal.coin)
            balance.amount += withdrawal.amount
            balance.save()
        
        return Response(WithdrawalSerializer(withdrawal).data)

class InvestmentManagementView(generics.ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = UserInvestmentSerializer
    queryset = UserInvestment.objects.all().order_by('-start_date')

class InvestmentPlanView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = InvestmentPlanSerializer
    queryset = InvestmentPlan.objects.all()

class InvestmentPlanDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = InvestmentPlanSerializer
    queryset = InvestmentPlan.objects.all()

class UserBalancesView(generics.ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = None
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            return Balance.objects.filter(user_id=user_id)
        return Balance.objects.all()

class ManualBalanceAdjustmentView(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def post(self, request):
        user_id = request.data.get('user_id')
        coin = request.data.get('coin')
        amount = request.data.get('amount')
        action = request.data.get('action', 'set')
        
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        balance, created = Balance.objects.get_or_create(user=user, coin=coin, defaults={'amount': 0})
        
        if action == 'set':
            balance.amount = amount
        elif action == 'add':
            balance.amount += float(amount)
        elif action == 'subtract':
            balance.amount -= float(amount)
        
        balance.save()
        
        return Response({
            'user_id': user.id,
            'coin': coin,
            'new_balance': str(balance.amount)
        })