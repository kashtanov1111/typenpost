import uuid
import os

from random import randint

from django.db import models
from django.contrib.auth import get_user_model
from django.template.defaultfilters import slugify

User = get_user_model()

class Post(models.Model):
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False)
    text = models.TextField(max_length=100000)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='posts')

    def __str__(self):
        return self.text[:40]

    class Meta:
        ordering = ['-created']