from rest_framework import serializers
from .models import Book, Bookshelf, Category, Series
from django.contrib.auth.models import User


class BookSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField(read_only=True)
    bookshelf_name = serializers.SerializerMethodField(read_only=True)
    series_title = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Book
        fields = [
            "id",
            "isbn",
            "title",
            "subtitle",
            "author",
            "bookshelf",
            "bookshelf_name",
            "category",
            "category_name",
            "series",
            "series_title",
            "volume_number",
            "user",
        ]
        read_only_fields = ["user"]

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None

    def get_bookshelf_name(self, obj):
        return obj.bookshelf.name if obj.bookshelf else None

    def get_series_title(self, obj):
        return obj.series.title if obj.series else None


class BookDetailSerializer(BookSerializer):
    google_data = serializers.SerializerMethodField(read_only=True)

    class Meta(BookSerializer.Meta):
        fields = BookSerializer.Meta.fields + ["google_data"]

    def get_google_data(self, obj):
        return obj.get_google_data()


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
