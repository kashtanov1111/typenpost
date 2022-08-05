from django.contrib import admin

from .models import Post
from comments.models import Comment

class CommentInline(admin.TabularInline):
    model = Comment
    extra = 1

class PostAdmin(admin.ModelAdmin):
    inlines = [CommentInline, ]
    model = Post

admin.site.register(Post, PostAdmin)
