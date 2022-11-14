from django.contrib import admin

from .models import Post, PostLike
from comments.models import Comment

class CommentInline(admin.TabularInline):
    model = Comment
    extra = 1

class LikeInline(admin.TabularInline):
    model = PostLike

class PostAdmin(admin.ModelAdmin):
    inlines = [CommentInline, LikeInline]
    model = Post

admin.site.register(Post, PostAdmin)
