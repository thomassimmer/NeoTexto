
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from allauth.socialaccount.providers.oauth2.views import (
    OAuth2CallbackView,
    OAuth2LoginView
)
from dj_rest_auth.registration.views import SocialLoginView
from google.auth.transport import requests
from google.oauth2 import id_token

# Thanks to https://gonzafirewall.medium.com/google-oauth2-and-django-rest-auth-92b0d8f70575


class CustomGoogleOAuth2Adapter(GoogleOAuth2Adapter):

    def complete_login(self, request, app, token, response, **kwargs):
        idinfo = id_token.verify_oauth2_token(
            token.token, requests.Request(), app.client_id)
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')
        extra_data = idinfo
        login = self.get_provider().sociallogin_from_response(
            request,
            extra_data
        )
        return login


oauth2_login = OAuth2LoginView.adapter_view(CustomGoogleOAuth2Adapter)
oauth2_callback = OAuth2CallbackView.adapter_view(CustomGoogleOAuth2Adapter)


class GoogleLoginView(SocialLoginView):
    # disable authentication, make sure to override `allowed origins` in settings.py in production!
    authentication_classes = []
    adapter_class = CustomGoogleOAuth2Adapter
    client_class = OAuth2Client
