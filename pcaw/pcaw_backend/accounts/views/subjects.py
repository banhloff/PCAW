from rest_framework import status, viewsets, generics, permissions
from permissions.permissions import IsTeacher, UserPermission, SubjectPermission, ClassPermission,\
                                    SubjectViewSetAction
from accounts.models.classes import Class, Subject
from accounts.serializers.classes import ClassSerializer, SubjectSerializer,\
                                        SubjectRepresentSerializer
from rest_framework.response import Response
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
PARAM_SEARCH = 'search'
PARAM_PAGING = 'paging'
class SubjectViewSet(viewsets.ModelViewSet):
    # serializer_class = SubjectSerializer
    queryset = Subject.objects.all().order_by('pk')
    permission_classes = (SubjectPermission, )
    pagination_class = PageNumberPagination
    pagination_class.page_size = 5
    def get_serializer_class(self):
        if self.action in [SubjectViewSetAction.list, SubjectViewSetAction.retrieve]:
            return SubjectRepresentSerializer 
        return SubjectSerializer
    
    def list(self, request, *args, **kwargs):
        search_str = self.request.query_params.get(PARAM_SEARCH)
        q = Q(is_deleted=False)

        if search_str is not None and search_str.strip() != "":
            q &= Q(name__icontains=search_str.strip())| Q(subject_code__icontains=search_str.strip())
        
        list = Subject.objects.filter(q).order_by('pk')
        paging_str = self.request.query_params.get(PARAM_PAGING)
        if paging_str is not None and paging_str.strip().lower() == 'false':
            return Response({"subjects": self.get_serializer(list, many=True).data, 
            }, status=status.HTTP_200_OK)
        page = self.paginate_queryset(list)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response({"subjects": self.get_serializer(list, many=True).data, 
            }, status=status.HTTP_200_OK)