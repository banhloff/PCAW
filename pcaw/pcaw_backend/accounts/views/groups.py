from django.contrib.auth.models import User, Group
from rest_framework.response import Response
from django.conf import settings
from rest_framework import status, viewsets, generics, permissions
from permissions.permissions import IsStaff
from accounts.serializers.accounts import GroupSerializer

class GroupViewSet(viewsets.ModelViewSet):
    permission_classes = (IsStaff, )
    serializer_class = GroupSerializer
    queryset = Group.objects.all()