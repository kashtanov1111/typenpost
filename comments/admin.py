from django.contrib import admin

from comments.models import Comment, CommentLike

class LikeInline(admin.TabularInline):
    model = CommentLike

class CommentAdmin(admin.ModelAdmin):
    inlines = [LikeInline,]
    model = Comment

admin.site.register(Comment, CommentAdmin)