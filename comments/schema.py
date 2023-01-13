import graphene
import django_filters
from graphene_django import DjangoObjectType
from django.db.models import Prefetch
from django.contrib.auth import get_user_model
from graphql_jwt.decorators import login_required

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

    class Meta:
        model = Comment
        fields = ('id', 'text', 'created', 'user', 'post', 'likes', 'uuid')
        filterset_class = CommentFilter
        interfaces = (graphene.relay.Node, )

    def resolve_uuid(parent, info):
        return parent.pk

    def resolve_number_of_likes(parent, info):
        return parent.likes.count()

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
    pass
    # comments = graphene.List(CommentType)

    # def resolve_comments(parent, info):
    #     return Comment.objects.all()


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

class Mutation(graphene.ObjectType):
    like_comment = LikeComment.Field()
    create_comment = CreateComment.Field()
