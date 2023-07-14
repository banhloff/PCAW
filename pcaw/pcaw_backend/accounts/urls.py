from django.urls import path
from accounts.views.accounts import KnoxRegistrationAPI, KnoxLoginAPI, ConfirmAPI, ChangePasswordAPI, UserAPI
from knox import views as knox_views
from django.conf import settings

urlpatterns = [
    path('user/', UserAPI.as_view()),
    path('register/', KnoxRegistrationAPI.as_view(), name='register'),
    path('login/', KnoxLoginAPI.as_view(), name='login'),
    path('confirm/<uidb64>/<token>/', ConfirmAPI.as_view(), name='confirm-register'),
    path('change-password/', ChangePasswordAPI.as_view(), name='change-password'),
    path('logout/', knox_views.LogoutView.as_view(), name='logout'),
    path('logoutall/', knox_views.LogoutAllView.as_view(), name='logoutall'),

]