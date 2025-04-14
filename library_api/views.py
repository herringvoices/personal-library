from rest_framework import viewsets, status
from .models import Book, Bookshelf, Category, Series
from .serializers import (
    BookSerializer,
    BookDetailSerializer,
    BookshelfSerializer,
    CategorySerializer,
    SeriesSerializer,
    UserSerializer,
)
from django.contrib.auth.models import User
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .services.google_books import fetch_book_data


class BookViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        """Return different serializers for list and detail views"""
        if self.action == "retrieve":
            return BookDetailSerializer
        return BookSerializer

    def get_queryset(self):
        """Return books that belong to the current authenticated user, with optional filtering"""
        queryset = Book.objects.filter(user=self.request.user)

        # Filter by bookshelf/bookcase if provided in query params
        bookshelf_id = self.request.query_params.get("bookshelf", None)
        if bookshelf_id is not None:
            queryset = queryset.filter(bookshelf_id=bookshelf_id)

        return queryset

    def perform_create(self, serializer):
        """
        Automatically assign the current user when creating a new book
        and populate book data from Google Books API
        """
        isbn = serializer.validated_data.get("isbn")

        # Fetch book data from Google Books API
        book_data = fetch_book_data(isbn)

        # Extract title, subtitle and author
        title = book_data.get("title", "Unknown Title")
        subtitle = book_data.get("subtitle", "")

        # Get primary author if available
        authors = book_data.get("authors", ["Unknown Author"])
        author = authors[0] if authors else "Unknown Author"

        # Save with data from Google Books
        serializer.save(
            user=self.request.user, title=title, subtitle=subtitle, author=author
        )

    def perform_update(self, serializer):
        """Ensure updates maintain the current user ownership"""
        serializer.save(user=self.request.user)


class BookshelfViewSet(viewsets.ModelViewSet):
    serializer_class = BookshelfSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return only bookshelves that belong to the current authenticated user"""
        return Bookshelf.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Automatically assign the current user when creating a new bookshelf"""
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """Ensure updates maintain the current user ownership"""
        serializer.save(user=self.request.user)


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return categories owned by the current user or used in their books"""
        # Include both categories created by this user AND those used in their books
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Automatically assign the current user when creating a new category"""
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """Ensure updates maintain the current user ownership"""
        serializer.save(user=self.request.user)


class SeriesViewSet(viewsets.ModelViewSet):
    serializer_class = SeriesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return series owned by the current user"""
        # Include all series created by this user, not just those used in books
        return Series.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Automatically assign the current user when creating a new series"""
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """Ensure updates maintain the current user ownership"""
        serializer.save(user=self.request.user)


class UserViewSet(viewsets.ReadOnlyModelViewSet):  # GET-only access
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Users can only see their own information
        """
        return User.objects.filter(id=self.request.user.id)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):
    """
    Retrieve the current authenticated user's details
    """
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


@api_view(["GET"])
@permission_classes([AllowAny])  # Making this public, modify if needed
def search_book_by_isbn(request):
    """
    Search for a book by ISBN using Google Books API
    """
    isbn = request.query_params.get("isbn")
    if not isbn:
        return Response(
            {"error": "ISBN parameter is required."}, status=status.HTTP_400_BAD_REQUEST
        )

    data = fetch_book_data(isbn)
    if not data:
        return Response(
            {"error": "No data found for the provided ISBN."},
            status=status.HTTP_404_NOT_FOUND,
        )
    return Response(data, status=status.HTTP_200_OK)
