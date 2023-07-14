from rest_framework import status, viewsets, generics, permissions
from permissions.permissions import SemesterPermission, SemesterViewSetAction
from accounts.models.classes import Class, Subject, Semester
from accounts.serializers.classes import SemesterSerializer
from rest_framework.response import Response
from django.db.models import Q
PARAM_PAGING = 'paging'
PARAM_SEARCH = 'search'
class SemesterViewSet(viewsets.ModelViewSet):
    serializer_class = SemesterSerializer
    queryset = Semester.objects.exclude(is_deleted=True).all().order_by('-date_end', 'pk')
    permission_classes = (SemesterPermission, )

    def list(self, request, *args, **kwargs):
        search_str = self.request.query_params.get(PARAM_SEARCH)
        q = Q(is_deleted=False)

        if search_str is not None and search_str.strip() != "":
            q &= Q(name__icontains=search_str.strip())
        paging_str = self.request.query_params.get(PARAM_PAGING)
        if paging_str is not None and paging_str.strip().lower() == 'false':
            return Response({"semesters": SemesterSerializer(list, many=True).data, 
            }, status=status.HTTP_200_OK)
        list = Semester.objects.filter(q).order_by('pk')
        page = self.paginate_queryset(list)
        if page is not None:
            serializer = SemesterSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response({"semesters": SemesterSerializer(list, many=True).data, 
            }, status=status.HTTP_200_OK)