import graphene
import django_filters
from django.db.models import Prefetch
from django.contrib.auth import get_user_model

from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField

from graphql_jwt.decorators import login_required

from .models import Post
from comments.models import Comment

from graphene import relay

from graphql_auth.schema import UserNode


class PostFilter(django_filters.FilterSet):
    text = django_filters.CharFilter(lookup_expr='iexact')

    class Meta:
        model = Post
        fields = {
            'text': ['icontains',],
        }

    order_by = django_filters.OrderingFilter(
        fields=(
            ('text', 'created',),
        )
    )


class PostNode(DjangoObjectType):
    user = graphene.Field(UserNode, required=False)
    number_of_likes = graphene.Int()
    number_of_comments = graphene.Int()
    has_i_liked = graphene.Boolean()
    uuid = graphene.UUID()

    class Meta:
        model = Post
        filterset_class = PostFilter
        fields = ('id', 'text', 'created',
                  'user', 'comments', 'likes', 'uuid')
        interfaces = (graphene.relay.Node, )

    def resolve_uuid(parent, info):
        return parent.pk

    def resolve_has_i_liked(parent, info):
        me = info.context.user
        if me.is_authenticated:
            try:
                if parent.am_i_in_likes:
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

    def resolve_number_of_likes(parent, info):
        try:
            return len(parent.all_likes)
        except:
            return parent.likes.filter(status__archived=False).count()

    def resolve_number_of_comments(parent, info):
        try:
            return len(parent.all_comments)
        except:
            return parent.comments.filter(user__status__archived=False).count()

    @classmethod
    def get_queryset(cls, queryset, info, *args, **kwargs):
        me_username = info.context.user.username
        return (
            queryset
            .select_related('user')
            .prefetch_related(
                Prefetch(
                    'likes',
                    queryset=(
                        get_user_model().objects
                        .filter(status__archived=False)),
                    to_attr='all_likes'
                ))
            .prefetch_related(
                Prefetch(
                    'comments',
                    queryset=(
                        Comment.objects
                        .filter(user__status__archived=False)),
                    to_attr='all_comments'
                ))
            .prefetch_related(
                Prefetch(
                    'likes',
                    queryset=(
                        get_user_model().objects
                        .filter(username=me_username)
                    ),
                    to_attr='am_i_in_likes'
                )
            )
        )


class Query(graphene.ObjectType):
    post = graphene.Field(PostNode, uuid=graphene.UUID())
    posts = DjangoFilterConnectionField(PostNode)
    feed = DjangoFilterConnectionField(PostNode)

    def resolve_post(parent, info, uuid):
        # user = info.context.user
        # if user.is_authenticated:
        #     me_username = user.username
        # else:
        #     me_username = None
        return (Post.objects
                .select_related('user__profile')
                .get(id=uuid))

    @login_required
    def resolve_feed(parent, info, *args, **kwargs):
        user = info.context.user
        return (Post.objects
                .feed(user=user)
                .select_related('user__profile')
                .filter(user__status__archived=False)
                )


class LikePost(graphene.Mutation):
    post = graphene.Field(PostNode)

    class Arguments:
        uuid = graphene.UUID(required=True)

    @login_required
    def mutate(root, info, uuid=None):
        user = info.context.user
        username = user.username
        post = Post.objects.get(id=uuid)
        if post.likes.filter(username=username).exists():
            post.likes.remove(user)
        else:
            post.likes.add(user)
        post.save()
        return LikePost(post=post)


class CreatePost(graphene.Mutation):
    post = graphene.Field(PostNode)

    class Arguments:
        text = graphene.String(required=True)

    @login_required
    def mutate(root, info, text):
        user = info.context.user
        post = Post(text=text, user=user)
        post.save()
        return CreatePost(post=post)


class UpdatePost(graphene.Mutation):
    post = graphene.Field(PostNode, id=graphene.UUID())

    class Arguments:
        id = graphene.UUID(required=True)
        text = graphene.String(required=True)

    @login_required
    def mutate(root, info, id=None, text=None):
        if id is not None and text is not None:
            user = info.context.user
            qs = Post.objects.filter(id=id, user=user)
            if qs.exists():
                post = qs.first()
                post.text = text
                post.save()
                return UpdatePost(post=post)
            else:
                raise Exception(
                    'There is no object with this id or you have not a permission to change this post')
        else:
            raise Exception('You have not provided id or text')


class DeletePost(graphene.Mutation):
    action = graphene.String()

    class Arguments:
        uuid = graphene.UUID(required=True)

    @login_required
    def mutate(root, info, uuid=None):
        user = info.context.user
        post = Post.objects.get(id=uuid)
        if post.user == user:
            post.delete()
            action = 'deleted'
            return DeletePost(action=action)
        else:
            action = 'not deleted'
            return DeletePost(action=action)


class Mutation(graphene.ObjectType):
    create_post = CreatePost.Field()
    update_post = UpdatePost.Field()
    like_post = LikePost.Field()
    delete_post = DeletePost.Field()
