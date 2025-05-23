from django.db import models
from django.contrib.auth import get_user_model

# For the User model
from django.contrib.auth.models import User as DjangoUser

User = get_user_model()  # type: type[DjangoUser]


class Category(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="categories", null=True
    )

    def __str__(self):
        return self.name


class Series(models.Model):
    title = models.CharField(max_length=255)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="series", null=True
    )

    def __str__(self):
        return self.title


class Bookshelf(models.Model):
    name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookshelves")

    def __str__(self):
        return f"{self.name} ({self.user.username})"


class Book(models.Model):
    isbn = models.CharField(max_length=13)
    title = models.CharField(max_length=255, default="Unknown Title")
    subtitle = models.CharField(max_length=255, blank=True, null=True)
    author = models.CharField(max_length=255, default="Unknown Author")
    small_thumbnail = models.URLField(max_length=1000, blank=True, null=True)
    large_thumbnail = models.URLField(max_length=1000, blank=True, null=True)
    details = models.TextField(blank=True, null=True)
    bookshelf = models.ForeignKey(
        Bookshelf, on_delete=models.CASCADE, related_name="books"
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="books")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    series = models.ForeignKey(Series, on_delete=models.SET_NULL, null=True, blank=True)
    volume_number = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} by {self.author}"

    @property
    def sort_key(self):
        return (
            self.category.name if self.category else "",
            self.author,
            1 if self.series else 0,
            self.series.title if self.series else "",
            self.volume_number or 0,
            self.title,
        )

    def get_google_data(self):
        from .services.google_books import fetch_book_data

        return fetch_book_data(self.isbn)
