from rest_framework import serializers
from django.contrib.auth.models import User, Group
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
import smtplib
from accounts.models.user_profiles import UserProfile
from email.mime.multipart import MIMEMultipart
from accounts.serializers.user_profiles import UserProfileSerializer
from email.mime.text import MIMEText
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode  
from django.utils.encoding import force_bytes, force_str 
from utils.mail_utils import send_confirm_mail
from pcaw_backend.pipeline import assign_permission_group, create_profile
class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(many=False, read_only=True)
    class Meta:
        model = User
        fields = ['id','username', 'email', 'first_name', 'last_name', 
                  'studies_classes','studies_subjects', 
                  'teaches_classes','teaches_subjects',
                  'groups', 'is_staff', 'is_active', 'is_superuser', 
                  'date_joined', 'last_login', 'profile']

class UserRepresentSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)
    profile = UserProfileSerializer(many=False, read_only=True)
    class Meta:
        model = User
        fields = ['id','username', 'email', 'first_name', 'last_name',
                  'groups', 'is_staff', 'is_active', 'is_superuser', 
                  'date_joined', 'last_login', 'profile']

class TeacherRepresentSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(many=False, read_only=True)
    class Meta:
        model = User
        fields = ['id','username', 'email', 'first_name', 
                  'last_name', 'teaches_classes','teaches_subjects', 'profile']
        depth = 1
class StudentRepresentSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(many=False, read_only=True)
    class Meta:
        model = User
        fields = ['id','username', 'email', 'first_name', 
                  'last_name', 'studies_classes','studies_subjects', 'profile']
        depth = 1
# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.RegexField(regex=settings.PASSWORD_REGEX, write_only=True)
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],email=validated_data['email'],
            password=validated_data['password'], first_name=validated_data['username'])
        assign_permission_group(user)
        create_profile(user)
        user.is_staff = False
        user.is_active = False
        user.save()
        #send email
        send_confirm_mail(user)
        
        return user

class KnoxLoginUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid Details.")

class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True, allow_blank=True)
    new_password = serializers.RegexField(regex=settings.PASSWORD_REGEX)