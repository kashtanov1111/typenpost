import graphene
from graphene_django import DjangoObjectType

from .models import Comment

# class CommentType(DjangoObjectType):

#     class Meta:
#         model = Comment
#         fields = ('id', 'text', 'created', 'updated', 'user', 'post')

class CommentNode(DjangoObjectType):

    class Meta:
        model = Comment
        fields = ('id', 'text', 'created', 'updated', 'user', 'post')
        interfaces = (graphene.relay.Node, )
        

class Query(graphene.ObjectType):
    pass
    # comments = graphene.List(CommentType)

    # def resolve_comments(parent, info):
    #     return Comment.objects.all()