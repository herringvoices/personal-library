from rest_framework import viewsets, status
from .models import Book, Bookshelf, Category, Series
from .serializers import (
    BookSerializer,
    BookshelfSerializer,
    CategorySerializer,
    SeriesSerializer,
    UserSerializer,
)
from django.contrib.auth.models import User
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    # Uncomment and modify if you want to restrict to current user:
    # def get_queryset(self):
    #     return Book.objects.filter(user=self.request.user)


class BookshelfViewSet(viewsets.ModelViewSet):
    queryset = Bookshelf.objects.all()
    serializer_class = BookshelfSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class SeriesViewSet(viewsets.ModelViewSet):
    queryset = Series.objects.all()
    serializer_class = SeriesSerializer


class UserViewSet(viewsets.ReadOnlyModelViewSet):  # GET-only access
    queryset = User.objects.all()
    serializer_class = UserSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):
    """
    Retrieve the current authenticated user's details
    """
    print("DEBUG: current_user view called!")  # Add this
    print(f"DEBUG: Auth header: {request.META.get('HTTP_AUTHORIZATION')}")  # Add this
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
    """
    Register a new user
    """
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        # Create a new user
        user = User.objects.create_user(
            username=request.data.get("username"),
            email=request.data.get("email"),
            password=request.data.get("password"),
        )
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
