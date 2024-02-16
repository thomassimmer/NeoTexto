"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from allauth.account.views import confirm_email
from django.conf import settings
from django.conf.urls import include
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView
from rest_framework import routers

from api.games import create_sentence
from api.googleviews import GoogleLoginView
from api.views import (
    LanguageViewSet,
    TextViewSet,
    TranslationViewSet,
    UserTranslationViewSet,
    UserViewSet,
    contact,
    detect_text
)

router = routers.DefaultRouter()
router.register(r"texts", TextViewSet, basename="text")
router.register(r"translations", TranslationViewSet, basename="translation")
router.register(r"user-translations", UserTranslationViewSet,
                basename="user-translation")
router.register(r"users", UserViewSet, basename="user")
router.register(r"languages", LanguageViewSet, basename="language")

urlpatterns = (
    [
        path('back/admin/', admin.site.urls),

        path('back/api/', include(router.urls)),
        path('back/api/social/login/google/',
             GoogleLoginView.as_view(),
             name="google"
             ),

        # Unused in django, it's an address for the front.
        path(
            "password-reset/confirm/<uidb64>/<token>/",
            TemplateView.as_view(template_name="password_reset_confirm.html"),
            name='password_reset_confirm'
        ),
        path('back/api/auth/', include("dj_rest_auth.urls")),
        path(
            'back/api/auth/registration/',
            include('dj_rest_auth.registration.urls')
        ),

        path(
            'back/api/accounts/',
            include('allauth.urls'),
            name='socialaccount_signup'
        ),

        path('back/api/detect-text/', detect_text),
        path('back/api/contact/', contact),
        path('back/api/game/create-sentence/', create_sentence),

        # Unused in django, it's an address for the front.
        re_path(
            r"^confirm-email/(?P<key>[-:\w]+)/$",
            confirm_email,
            name="account_confirm_email",
        ),

    ]
    + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
)
