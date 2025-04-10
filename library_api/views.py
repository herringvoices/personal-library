from rest_framework import viewsets
from .models import Book, Bookshelf, Category, Series
from .serializers import (
    BookSerializer,
    BookshelfSerializer,
    CategorySerializer,
    SeriesSerializer,
    UserSerializer,
)
from django.contrib.auth.models import User
from rest_framework.permissions import IsAdminUser


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
    permission_classes = [IsAdminUser]  # Only admins can view all users

    # Optionally, add a /me endpoint:
    # from rest_framework.decorators import action
    # from rest_framework.response import Response
    #
    # @action(detail=False, methods=['get'])
    # def me(self, request):
    #     serializer = self.get_serializer(request.user)
    #     return Response(serializer.data)
