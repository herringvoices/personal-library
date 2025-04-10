from rest_framework import serializers
from .models import Book, Bookshelf, Category, Series
from django.contrib.auth.models import User


class BookSerializer(serializers.ModelSerializer):
    google_data = serializers.SerializerMethodField()
    sort_key = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = "__all__"  # This automatically includes all model fields
        # The read_only_fields setting tells DRF not to expect or require
        # the user field in the input data during validation.
        # This allows the perform_create method in the ViewSet to set the user
        # after validation passes.
        read_only_fields = ["user"]

    def get_google_data(self, obj):
        return obj.get_google_data()

    def get_sort_key(self, obj):
        return obj.sort_key


class BookshelfSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookshelf
        fields = "__all__"
        # Making user field read-only prevents validation errors during
        # POST/PUT operations since the user will be set by the ViewSet
        read_only_fields = ["user"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"
        # Making user field read-only prevents validation errors during
        # POST/PUT operations since the user will be set by the ViewSet
        read_only_fields = ["user"]


class SeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Series
        fields = "__all__"
        # Making user field read-only prevents validation errors during
        # POST/PUT operations since the user will be set by the ViewSet
        read_only_fields = ["user"]


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}
