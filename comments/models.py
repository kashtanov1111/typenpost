import uuid
import os

from random import randint

from django.contrib.auth import get_user_model
from django.db import models
from django.template.defaultfilters import slugify

from posts.models import Post

User = get_user_model()

class CommentLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey("Comment", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)


class Comment(models.Model):
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False)
    text = models.TextField(max_length=2000)
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='comments')
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name='comments')
    likes = models.ManyToManyField(
        User,
        related_name='comment_likes',
        blank=True,
        null=True,
        through=CommentLike)
    reply = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')

    def __str__(self):
        return self.text[:40]
    
    class Meta:
        ordering = ['-created']
