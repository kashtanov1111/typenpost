import uuid
import os

from random import randint

from django.contrib.auth import get_user_model
from django.db import models
from django.template.defaultfilters import slugify

from posts.models import Post

User = get_user_model()

class Comment(models.Model):
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False)
    text = models.TextField(max_length=50000)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='comments')
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name='comments')

    def __str__(self):
        return self.text[:40]