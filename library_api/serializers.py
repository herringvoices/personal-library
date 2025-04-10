from rest_framework import serializers
from .models import Book, Bookshelf, Category, Series
from django.contrib.auth.models import User


class BookSerializer(serializers.ModelSerializer):
    google_data = serializers.SerializerMethodField()
    sort_key = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = "__all__"  # This automatically includes all model fields

    def get_google_data(self, obj):
        return obj.get_google_data()

    def get_sort_key(self, obj):
        return obj.sort_key


class BookshelfSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookshelf
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class SeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Series
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]
