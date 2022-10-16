import graphene

from graphene_django.debug import DjangoDebug

import accounts.schema as UserSchema
import posts.schema as PostSchema
import comments.schema as CommentSchema

class Query(PostSchema.Query, 
            UserSchema.Query, 
            CommentSchema.Query,
            graphene.ObjectType):
    debug = graphene.Field(DjangoDebug, name='_debug')

class Mutation(PostSchema.Mutation,
               UserSchema.Mutation, 
               graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)
