from django.contrib import admin
from .models import User, Balance

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'kyc_status', 'is_staff')
    list_filter = ('kyc_status', 'is_staff', 'is_active')
    search_fields = ('email', 'username')

@admin.register(Balance)
class BalanceAdmin(admin.ModelAdmin):
    list_display = ('user', 'coin', 'amount')
    list_filter = ('coin',)
    search_fields = ('user__email', 'user__username')
