# Generated by Django 4.1 on 2022-11-13 15:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0005_postlike_post_likes_postlike_post_postlike_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='updated',
        ),
    ]
