from django.conf import settings
from storages.backends.s3boto3 import S3Boto3Storage


# class StaticStorage(S3Boto3Storage):
#     location = 'static'
#     default_acl = 'public-read'


# class PublicMediaStorage(S3Boto3Storage):
#     location = 'media'
#     default_acl = 'public-read'
#     file_overwrite = False

class StaticStorage(S3Boto3Storage):
    location = 'static'

    def __init__(self, *args, **kwargs):
        kwargs['custom_domain'] = settings.AWS_CLOUDFRONT_CUSTOM_DOMAIN
        super().__init__(*args, **kwargs)


class PublicMediaStorage(S3Boto3Storage):
    location = 'media'
    
    def __init__(self, *args, **kwargs):
        kwargs['custom_domain'] = settings.AWS_CLOUDFRONT_CUSTOM_DOMAIN
        super().__init__(*args, **kwargs)


class ProtectedMediaStorage(S3Boto3Storage):
    location = 'protected'
    default_acl = 'public-read'
    #file_overwrite = False
    #custom_domain = False