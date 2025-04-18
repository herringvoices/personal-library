# Generated by Django 5.2 on 2025-04-15 17:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('library_api', '0003_book_author_book_subtitle_book_title'),
    ]

    operations = [
        migrations.AddField(
            model_name='book',
            name='details',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='book',
            name='large_thumbnail',
            field=models.URLField(blank=True, max_length=1000, null=True),
        ),
        migrations.AddField(
            model_name='book',
            name='small_thumbnail',
            field=models.URLField(blank=True, max_length=1000, null=True),
        ),
    ]
