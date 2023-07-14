from accounts.models.user_profiles import UserProfile 
from rest_framework import serializers

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['user', 'bio', 'code']
        read_only_fields = ['user',]
        # depth = 1