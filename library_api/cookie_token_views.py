from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from rest_framework.decorators import api_view
from datetime import datetime, timedelta


class CookieTokenObtainPairView(TokenObtainPairView):
    def finalize_response(self, request, response, *args, **kwargs):
        if response.status_code == 200:
            # Set JWT cookies
            response.set_cookie(
                settings.SIMPLE_JWT["AUTH_COOKIE"],
                response.data["access"],
                max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds(),
                secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
                samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
                path=settings.SIMPLE_JWT["AUTH_COOKIE_PATH"],
            )
            response.set_cookie(
                settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"],
                response.data["refresh"],
                max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds(),
                secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
                samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
                path=settings.SIMPLE_JWT["AUTH_COOKIE_PATH"],
            )
        return super().finalize_response(request, response, *args, **kwargs)


class CookieTokenRefreshView(TokenRefreshView):
    def finalize_response(self, request, response, *args, **kwargs):
        if response.status_code == 200:
            # Update access token cookie
            response.set_cookie(
                settings.SIMPLE_JWT["AUTH_COOKIE"],
                response.data["access"],
                max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds(),
                secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
                samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
                path=settings.SIMPLE_JWT["AUTH_COOKIE_PATH"],
            )
        return super().finalize_response(request, response, *args, **kwargs)


class CookieTokenVerifyView(TokenVerifyView):
    pass


@api_view(["POST"])
def logout_view(request):
    response = Response({"detail": "Successfully logged out."})

    # Option 1: Delete cookies (current implementation)
    response.delete_cookie(settings.SIMPLE_JWT["AUTH_COOKIE"])
    response.delete_cookie(settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"])

    # Option 2: Set cookies to expire in the past
    # expired_date = datetime.now() - timedelta(days=7)
    # response.set_cookie(
    #     settings.SIMPLE_JWT["AUTH_COOKIE"],
    #     '',
    #     expires=expired_date,
    #     path=settings.SIMPLE_JWT["AUTH_COOKIE_PATH"],
    # )
    # response.set_cookie(
    #     settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"],
    #     '',
    #     expires=expired_date,
    #     path=settings.SIMPLE_JWT["AUTH_COOKIE_PATH"],
    # )

    return response
