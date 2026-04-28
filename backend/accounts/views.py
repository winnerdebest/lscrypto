from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import (
    UserSerializer, RegisterSerializer, GoogleLoginSerializer,
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer
)
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Balance
import resend
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings

User = get_user_model()

class PasswordResetRequestView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        user = User.objects.filter(email=email).first()
        
        if user:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_link = f"{settings.FRONTEND_URL}/auth/reset-password?uid={uid}&token={token}"
            
            resend.api_key = settings.RESEND_API_KEY
            
            try:
                params = {
                    "from": settings.EMAIL_FROM,
                    "to": [email],
                    "subject": "Reset your CryptoVault Password",
                    "html": f"""
                        <div style="font-family: sans-serif; max-width: 600px; margin: auto; background-color: #080B14; color: #fff; padding: 40px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
                            <h2 style="color: #00FF94;">Password Reset Request</h2>
                            <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6;">Hello,</p>
                            <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6;">You requested a password reset for your CryptoVault account. Click the button below to set a new password:</p>
                            <div style="margin: 40px 0;">
                                <a href="{reset_link}" style="background-color: #00FF94; color: #000; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">Reset Password</a>
                            </div>
                            <p style="color: #94a3b8; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
                            <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 40px 0;" />
                            <p style="font-size: 12px; color: #64748b;">&copy; 2026 CryptoVault. All rights reserved.</p>
                        </div>
                    """
                }
                resend.Emails.send(params)
            except Exception as e:
                print(f"Resend Error: {str(e)}")
                return Response({"detail": f"Error sending email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"detail": "If an account exists with this email, a reset link has been sent."}, status=status.HTTP_200_OK)

class PasswordResetConfirmView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        uidb64 = serializer.validated_data['uidb64']
        token = serializer.validated_data['token']
        password = serializer.validated_data['password']
        
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
            
        if user and default_token_generator.check_token(user, token):
            user.set_password(password)
            user.save()
            return Response({"detail": "Password has been reset successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid or expired reset link."}, status=status.HTTP_400_BAD_REQUEST)

class GoogleLoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = GoogleLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        idinfo = serializer.validated_data
        
        email = idinfo.get('email')
        if not email:
            return Response({'detail': 'Google account must have an email'}, status=status.HTTP_400_BAD_REQUEST)
            
        username = email.split('@')[0]
        
        user, created = User.objects.get_or_create(email=email, defaults={
            'username': username,
        })
        
        if created:
            user.set_unusable_password()
            user.save()
            for coin in ['BTC', 'ETH', 'USDT']:
                Balance.objects.create(user=user, coin=coin)

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)

class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        from django.contrib.auth import authenticate
        email = request.data.get('email')
        password = request.data.get('password')
        
        user = authenticate(email=email, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    def post(self, request):
        return Response({'detail': 'Successfully logged out'}, status=status.HTTP_200_OK)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class ProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user
