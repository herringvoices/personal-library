"""
URL configuration for personal_library project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from library_api.cookie_token_views import (
    CookieTokenObtainPairView,
    CookieTokenRefreshView,
    CookieTokenVerifyView,
    logout_view,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    # JWT authentication endpoints
    path("api/token/", CookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/verify/", CookieTokenVerifyView.as_view(), name="token_verify"),
    path("api/logout/", logout_view, name="auth_logout"),
    # Your API routes
    path("api/", include("library_api.urls")),
]
