from django.contrib.auth.models import User
from permissions.permissions import UserProfilePermission
from django.contrib.auth.tokens import default_token_generator
from rest_framework.response import Response
from accounts.serializers.user_profiles import UserProfileSerializer
from rest_framework import status, viewsets, generics, permissions
from rest_framework.decorators import action
from django.conf import settings
from knox.models import AuthToken
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode  
from django.utils.encoding import force_bytes, force_str  
from django.db.models import Q
from accounts.models.user_profiles import UserProfile
from rest_framework.pagination import PageNumberPagination
from utils.utils import is_teacher
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from pcaw_backend.pipeline import create_profile
class UserProfileViewSet(viewsets.ModelViewSet):
    permission_classes = (UserProfilePermission, )
    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all() 
    pagination_class = PageNumberPagination
    pagination_class.page_size = 5
    parser_classes = (MultiPartParser, FormParser, JSONParser, )

    def retrieve(self, request, pk, *args, **kwargs):
        if is_teacher(request.user):
            if UserProfile.objects.filter(user__pk=pk).count() == 0:
                return Response({"message":"Not Found"}, status=status.HTTP_404_NOT_FOUND)
            else:
                profile = UserProfile.objects.get(user__pk=pk)
                Response({"profile":self.get_serializer(profile, many=False).data},
                        status=status.HTTP_200_OK)
        if request.user.profile is None:
            create_profile(request.user)
        return Response({"profile":self.get_serializer(request.user.profile, many=False).data},
                        status=status.HTTP_200_OK)
    
    def update(self, request, pk, *args, **kwargs):
        update_profile = UserProfile.objects.get(pk=pk)
        modified_data = request.data.copy()
        if not request.user.is_staff:
            modified_data['code'] = update_profile.code
        serializer = self.get_serializer(update_profile, modified_data, partial = True)
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response({
                "message":"Update Succeeded",
                "profile": UserProfileSerializer(update_profile).data
            }, status=status.HTTP_200_OK)
    def partial_update(self, request, pk, *args, **kwargs):
        update_profile = UserProfile.objects.get(pk=pk)
        modified_data = request.data.copy()
        if not request.user.is_staff:
            modified_data['code'] = update_profile.code
        serializer = self.get_serializer(update_profile, modified_data, partial = True)
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response({
                "message":"Update Succeeded",
                "profile": UserProfileSerializer(update_profile).data
            }, status=status.HTTP_200_OK)