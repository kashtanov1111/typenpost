import graphene
import django_filters
from graphene_django import DjangoObjectType
from django.db.models import Prefetch
from django.contrib.auth import get_user_model
from graphql_jwt.decorators import login_required
from graphene_django.filter import DjangoFilterConnectionField

from graphql_auth.schema import UserNode

from .models import Comment
from posts.models import Post


class CommentFilter(django_filters.FilterSet):
    text = django_filters.CharFilter(lookup_expr='iexact')

    class Meta:
        model = Comment
        fields = {
            'text': ['icontains',],
        }

    order_by = django_filters.OrderingFilter(
        fields=(
            ('text', 'created',),
        )
    )


class CommentNode(DjangoObjectType):
    user = graphene.Field(UserNode, required=False)
    number_of_likes = graphene.Int()
    has_i_liked = graphene.Boolean()
    uuid = graphene.UUID()
    number_of_replies = graphene.Int()

    class Meta:
        model = Comment
        fields = ('id', 'text', 'created', 'user', 
            'post', 'likes', 'uuid', 'replies', 'reply')
        filterset_class = CommentFilter
        interfaces = (graphene.relay.Node, )

    def resolve_uuid(parent, info):
        return parent.pk

    def resolve_number_of_likes(parent, info):
        return parent.likes.count()

    def resolve_number_of_replies(parent, info):
        return parent.replies.count()

    def resolve_has_i_liked(parent, info):
        me = info.context.user
        if me.is_authenticated:
            try:
                if parent.amIInLikes:
                    return True
                else:
                    return False
            except:
                if parent.likes.filter(username=me.username).exists():
                    return True
                else:
                    return False

        else:
            return False

    @classmethod
    def get_queryset(cls, queryset, info):
        me_username = info.context.user.username
        return (
            queryset
            .select_related('user__profile')
            .prefetch_related(
                Prefetch(
                    'likes',
                    queryset=(
                        get_user_model().objects
                        .filter(status__archived=False))
                ))
            .prefetch_related('replies')
            .prefetch_related(
                Prefetch(
                    'likes',
                    queryset=(
                        get_user_model().objects
                        .filter(username=me_username)
                    ),
                    to_attr='amIInLikes'
                )
            )
            .filter(user__status__archived=False)
        )


class Query(graphene.ObjectType):
    comment = graphene.Field(CommentNode, uuid=graphene.UUID())

    def resolve_comment(parent, info, uuid):
        return (Comment.objects
                .get(id=uuid))



class LikeComment(graphene.Mutation):
    comment = graphene.Field(CommentNode)

    class Arguments:
        uuid = graphene.UUID(required=True)

    @login_required
    def mutate(root, info, uuid=None):
        user = info.context.user
        username = user.username
        comment = Comment.objects.get(id=uuid)
        if comment.likes.filter(username=username).exists():
            comment.likes.remove(user)
        else:
            comment.likes.add(user)
        comment.save()
        return LikeComment(comment=comment)


class CreateComment(graphene.Mutation):
    comment = graphene.Field(CommentNode)

    class Arguments:
        text = graphene.String(required=True)
        post_uuid = graphene.UUID(required=True)

    @login_required
    def mutate(root, info, text, post_uuid):
        user = info.context.user
        post = Post.objects.get(id=post_uuid)
        comment = Comment(text=text, user=user, post=post)
        comment.save()
        return CreateComment(comment=comment)

class CreateReplyToComment(graphene.Mutation):
    comment = graphene.Field(CommentNode)

    class Arguments:
        text = graphene.String(required=True)
        comment_uuid = graphene.UUID(required=True)

    @login_required
    def mutate(root, info, text, comment_uuid):
        user = info.context.user
        comment = Comment.objects.get(id=comment_uuid)
        post = comment.post
        replyToComment = Comment(text=text, user=user, post=post, reply=comment)
        replyToComment.save()
        return CreateComment(comment=replyToComment)

class DeleteComment(graphene.Mutation):
    action = graphene.String()
    number_of_replies = graphene.Int()

    class Arguments:
        uuid = graphene.UUID(required=True)

    @login_required
    def mutate(root, info, uuid=None):
        user = info.context.user
        comment = Comment.objects.get(id=uuid)
        number_of_replies = comment.replies.count()
        if comment.user == user:
            comment.delete()
            action = 'deleted'
            return DeleteComment(action=action, number_of_replies=number_of_replies)
        else:
            action = 'not deleted'
            return DeleteComment(action=action, number_of_replies=number_of_replies)

class Mutation(graphene.ObjectType):
    like_comment = LikeComment.Field()
    create_comment = CreateComment.Field()
    delete_comment = DeleteComment.Field()
    create_reply_to_comment = CreateReplyToComment.Field()
