import uuid

from django.db import models
from django.db.models import Q
from django.contrib.auth import get_user_model
from django.template.defaultfilters import slugify

User = get_user_model()


class PostQueryset(models.QuerySet):

    def feed(self, user):
        user_following = user.profile.following
        followed_users_ids = []
        if user_following.exists():
            followed_users_ids = (user_following
                                  .values_list('user__id', flat=True))
        return self.filter(
            Q(user__id__in=followed_users_ids) |
            Q(user=user)
        ).distinct().order_by('-created')


class PostManager(models.Manager):

    def get_queryset(self):
        return PostQueryset(self.model, using=self._db)

    def feed(self, user):
        return self.get_queryset().feed(user)


class PostLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey("Post", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)


class Post(models.Model):
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False)
    text = models.TextField(max_length=100000)
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='posts')
    likes = models.ManyToManyField(
        User,
        related_name='likes',
        blank=True,
        null=True,
        through=PostLike)

    objects = PostManager()

    def __str__(self):
        return self.text[:40]

    class Meta:
        ordering = ['-created']
