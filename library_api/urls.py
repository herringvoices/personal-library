from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    BookViewSet,
    BookshelfViewSet,
    CategoryViewSet,
    SeriesViewSet,
    UserViewSet,
)

# Create the DRF router and register your viewsets
router = DefaultRouter()
router.register(r"books", BookViewSet, basename="book")
router.register(r"bookshelves", BookshelfViewSet, basename="bookshelf")
router.register(r"categories", CategoryViewSet, basename="category")
router.register(r"series", SeriesViewSet, basename="series")
router.register(r"users", UserViewSet, basename="user")

# The router generates the URL patterns
urlpatterns = router.urls
