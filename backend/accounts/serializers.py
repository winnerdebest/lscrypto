from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.conf import settings
from .models import Balance
from google.oauth2 import id_token
from google.auth.transport import requests

User = get_user_model()

import requests as py_requests

class GoogleLoginSerializer(serializers.Serializer):
    id_token = serializers.CharField(required=False)
    access_token = serializers.CharField(required=False)

    def validate(self, attrs):
        id_token_str = attrs.get('id_token')
        access_token_str = attrs.get('access_token')

        if id_token_str:
            try:
                idinfo = id_token.verify_oauth2_token(
                    id_token_str, requests.Request(), settings.GOOGLE_CLIENT_ID
                )
                return idinfo
            except ValueError:
                raise serializers.ValidationError("Invalid Google ID token")
        
        if access_token_str:
            response = py_requests.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                params={'access_token': access_token_str}
            )
            if response.status_code != 200:
                raise serializers.ValidationError("Invalid Google access token")
            return response.json()

        raise serializers.ValidationError("Either id_token or access_token is required")

class BalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Balance
        fields = ['coin', 'amount']

class UserSerializer(serializers.ModelSerializer):
    balances = BalanceSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'kyc_status', 'balances']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password']

    def create(self, validated_data):
        email = validated_data['email']
        username = email.split('@')[0]
        
        # Ensure username is unique
        if User.objects.filter(username=username).exists():
            username = f"{username}_{User.objects.count()}"

        user = User.objects.create_user(
            username=username,
            email=email,
            password=validated_data['password']
        )
        # Initialize zero balances for supported coins
        for coin in ['BTC', 'ETH', 'USDT']:
            Balance.objects.create(user=user, coin=coin)
        return user

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetConfirmSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=6)
    token = serializers.CharField()
    uidb64 = serializers.CharField()
