# Generated by Django 4.1 on 2023-01-12 18:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0006_comment_likes_comment_reply'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='comment',
            options={'ordering': ['-created']},
        ),
    ]
