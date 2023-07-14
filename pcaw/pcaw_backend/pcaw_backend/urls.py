from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from rest_framework import routers
from assignments.views.submissions import SubmissionViewSet
from assignments.views.assignments import AssignmentViewSet
from accounts.views.accounts import AccountViewSet
from accounts.views.classes import ClassViewSet
from accounts.views.subjects import SubjectViewSet
from accounts.views.semesters import SemesterViewSet
from assignments.views.langs import LangViewSet
from accounts.views.user_profiles import UserProfileViewSet
from accounts.views.groups import GroupViewSet
from django.urls import re_path
from pcaw_backend.views.dashboard import DashBoardView

admin.site.site_header = settings.ADMIN_SITE_HEADER
admin.site.site_title = settings.ADMIN_SITE_TITLE
admin.site.index_title = settings.ADMIN_SITE_INDEX_TITLE

#register router for viewsets
#no need trailing '/'
router = routers.DefaultRouter()
router.register(r'api/submissions', SubmissionViewSet, basename="submissions")
router.register(r'api/assignments', AssignmentViewSet, basename="assignments")
router.register(r'api/accounts', AccountViewSet, basename="accounts")
router.register(r'api/classes', ClassViewSet, basename="classes")
router.register(r'api/subjects', SubjectViewSet, basename="subjects")
router.register(r'api/semesters', SemesterViewSet, basename="semesters")
router.register(r'api/langs', LangViewSet, basename="langs")
router.register(r'api/userprofiles', UserProfileViewSet, basename="userprofiles")
router.register(r'api/groups', GroupViewSet, basename="groups")
urlpatterns = [
    # Examples:
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/assignments/', include('assignments.urls')),
    path('auth-knox/', include('knox.urls')),
    re_path(r'^auth-social/', include('drf_social_oauth2.urls', namespace='drf')),
    path('', include(router.urls)),
    path('api/dashboard/', DashBoardView.as_view()),
]

if settings.DEBUG:
	urlpatterns+= static(settings.STATIC_URL,document_root=settings.STATIC_ROOT)
	urlpatterns+= static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)