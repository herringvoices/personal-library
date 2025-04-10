from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    BookViewSet,
    BookshelfViewSet,
    CategoryViewSet,
    SeriesViewSet,
    UserViewSet,
    current_user,
    register_user,
    search_book_by_isbn,
)

# Create custom URL patterns first
# When I had them after, they were not workinh (404 error)
# I think it was trying to access /users/me/ as if it were /users/{id}/
urlpatterns = [
    path("users/me/", current_user, name="current_user"),
    path("register/", register_user, name="register_user"),
    path(
        "books/search/", search_book_by_isbn, name="search_book_by_isbn"
    ),  # Add new endpoint
]

# Then add router-generated URLs
router = DefaultRouter()
router.register(r"books", BookViewSet, basename="book")
router.register(r"bookshelves", BookshelfViewSet, basename="bookshelf")
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"series", SeriesViewSet, basename="series")
router.register(r"users", UserViewSet, basename="user")

# Extend urlpatterns with router URLs
urlpatterns += router.urls
