"""
Django settings for config project.

Generated by 'django-admin startproject' using Django 4.0.6.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.0/ref/settings/
"""

from datetime import timedelta

from pathlib import Path
from environs import Env

env = Env()
env.read_env()

is_production = True

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env("DJANGO_SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool("DJANGO_DEBUG", default=False)

if is_production:
    ALLOWED_HOSTS = [".herokuapp.com", ".typenpost.com"]
else:
    ALLOWED_HOSTS = [
        ".herokuapp.com",
        "localhost",
        "127.0.0.1",
        ".typenpost.com",
        "testserver",
    ]

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party
    "debug_toolbar",
    "storages",
    "graphene_django",
    "corsheaders",
    "django_cleanup.apps.CleanupConfig",
    "graphql_jwt.refresh_token.apps.RefreshTokenConfig",
    "django_filters",
    "graphql_auth",
    # Local
    "accounts",
    "posts",
    "comments",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "debug_toolbar.middleware.DebugToolbarMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [str(BASE_DIR.joinpath("templates"))],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"


# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases


DATABASES = {
    "default": env.dj_db_url("DATABASE_URL", default="postgres://postgres@db/postgres")
}


# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

# DEBUG_TOOLBAR_CONFIG = {'INSERT_BEFORE':'</head>'}
# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

##########################New#########################

import socket

hostname, _, ips = socket.gethostbyname_ex(socket.gethostname())
INTERNAL_IPS = [ip[:-1] + "1" for ip in ips] + ["127.0.0.1", "localhost"]

SECURE_SSL_REDIRECT = env.bool("DJANGO_SECURE_SSL_REDIRECT", default=True)
SECURE_HSTS_SECONDS = env.int("DJANGO_SECURE_HSTS_SECONDS", default=2592000)
SECURE_HSTS_INCLUDE_SUBDOMAINS = env.bool(
    "DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS", default=True
)
SECURE_HSTS_PRELOAD = env.bool("DJANGO_SECURE_HSTS_PRELOAD", default=True)
SESSION_COOKIE_SECURE = env.bool("DJANGO_SESSION_COOKIE_SECURE", default=True)
CSRF_COOKIE_SECURE = env.bool("DJANGO_CSRF_COOKIE_SECURE", default=True)
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")


USE_S3 = env.bool("USE_S3", default=True)

if USE_S3:
    # aws settings
    AWS_ACCESS_KEY_ID = env("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = env("AWS_SECRET_ACCESS_KEY")
    AWS_STORAGE_BUCKET_NAME = env("AWS_STORAGE_BUCKET_NAME")
    AWS_CLOUDFRONT_DOMAIN = env("AWS_CLOUDFRONT_DOMAIN")
    AWS_S3_CUSTOM_DOMAIN = f"{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com"
    AWS_CLOUDFRONT_CUSTOM_DOMAIN = f"{AWS_CLOUDFRONT_DOMAIN}.cloudfront.net"
    PUBLIC_URL = AWS_S3_CUSTOM_DOMAIN
    # s3 static settings
    AWS_LOCATION = "static"
    STATIC_URL = f"https://{AWS_CLOUDFRONT_CUSTOM_DOMAIN}/{AWS_LOCATION}/"
    STATICFILES_STORAGE = "config.storage_backends.StaticStorage"
    # s3 public media settings
    PUBLIC_MEDIA_LOCATION = "media"
    MEDIA_URL = f"https://{AWS_CLOUDFRONT_CUSTOM_DOMAIN}/{PUBLIC_MEDIA_LOCATION}/"
    DEFAULT_FILE_STORAGE = "config.storage_backends.PublicMediaStorage"
    # s3 private media settings
    PROTECTED_DIR_NAME = "protected"
    PROTECTED_MEDIA_URL = "//%s.s3.amazonaws.com/%s/" % (
        AWS_STORAGE_BUCKET_NAME,
        PROTECTED_DIR_NAME,
    )
    S3DIRECT_REGION = "us-east-2"
else:

    MEDIA_URL = "/media/"
    MEDIA_ROOT = str(BASE_DIR.joinpath("media"))
    PROTECTED_ROOT = str(BASE_DIR.joinpath("protected_media"))

    STATIC_URL = "/static/"
    STATIC_ROOT = str(BASE_DIR.joinpath("staticfiles"))

STATICFILES_DIRS = [str(BASE_DIR.joinpath("static"))]

AUTH_USER_MODEL = "accounts.CustomUser"

GRAPHENE = {
    "SCHEMA": "config.schema.schema",
    "MIDDLEWARE": [
        "graphql_jwt.middleware.JSONWebTokenMiddleware",
        "graphene_django.debug.DjangoDebugMiddleware",
    ],
}

import django
from django.utils.encoding import force_str
from django.utils.translation import gettext, gettext_lazy

django.utils.encoding.force_text = force_str
django.utils.translation.ugettext = gettext
django.utils.translation.ugettext_lazy = gettext_lazy

CORS_ORIGIN_ALLOW_ALL = False
if is_production:
    CORS_ORIGIN_WHITELIST = [
        "https://www.typenpost.com",
        "https://typenpost1.herokuapp.com/",
    ]
else:
    CORS_ORIGIN_WHITELIST = ["http://localhost:3000", "https://www.typenpost.com"]

CORS_ALLOW_CREDENTIALS = True

AUTHENTICATION_BACKENDS = [
    "graphql_auth.backends.GraphQLAuthBackend",
    "django.contrib.auth.backends.ModelBackend",
]

GRAPHQL_JWT = {
    "JWT_ALLOW_ANY_CLASSES": [
        "graphql_auth.mutations.Register",
        "graphql_auth.mutations.VerifyAccount",
        "graphql_auth.mutations.ResendActivationEmail",
        "graphql_auth.mutations.SendPasswordResetEmail",
        "graphql_auth.mutations.PasswordReset",
        "graphql_auth.mutations.ObtainJSONWebToken",
        "graphql_auth.mutations.VerifyToken",
        "graphql_auth.mutations.RefreshToken",
        "graphql_auth.mutations.RevokeToken",
        "graphql_auth.mutations.VerifySecondaryEmail",
    ],
    "JWT_VERIFY_EXPIRATION": True,
    "JWT_LONG_RUNNING_REFRESH_TOKEN": True,
    "JWT_EXPIRATION_DELTA": timedelta(seconds=60),
    "JWT_REFRESH_EXPIRATION_DELTA": timedelta(days=7),
    "JWT_COOKIE_SECURE": env.bool("JWT_COOKIE_SECURE", default=True),
    "JWT_COOKIE_SAMESITE": (
        None if env("JWT_COOKIE_SAMESITE", default=False) else "Lax"
    ),
}
GRAPHQL_AUTH = {
    "ALLOW_LOGIN_NOT_VERIFIED": False,
    "ACTIVATION_SECONDARY_EMAIL_PATH_ON_EMAIL": "activate2email",
}

# email settings
if is_production:
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
else:
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
EMAIL_HOST = "smtp-relay.sendinblue.com"
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST_USER = "kashtanovdjango@gmail.com"
EMAIL_HOST_PASSWORD = env("EMAIL_PASSWORD")
DEFAULT_FROM_EMAIL = "typenpost@gmail.com"

DATA_UPLOAD_MAX_MEMORY_SIZE = 10485761
