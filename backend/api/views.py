import re
import threading
from smtplib import SMTPException
from typing import Any

from django.conf import settings
from django.core.mail import send_mail
from django.db.models import Prefetch, Q
from django.http import JsonResponse
from google.cloud import vision
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from api.models import (
    CustomUserModel,
    Example,
    Language,
    Text,
    Translation,
    UserTranslation
)
from api.permissions import (
    TextPermission,
    UserPermission,
    UserTranslationPermission
)
from api.serializers import (
    ContactFormSerializer,
    CustomUserModelSerializer,
    ExampleSerializer,
    LanguageModelSerializer,
    TextSerializer,
    TranslationSerializer,
    UserTranslationSerializer
)
from api.utils import (
    ask_gpt_to_generate_a_text,
    get_model_from_language,
    split_text_with_spacy
)
from api.utils.translation import (
    get_chatgpt_translation,
    get_microsoft_translation,
    get_yandex_translation
)


@permission_classes([TextPermission])
class TextViewSet(
        mixins.CreateModelMixin,
        mixins.RetrieveModelMixin,
        mixins.ListModelMixin,
        mixins.DestroyModelMixin,
        viewsets.GenericViewSet):
    serializer_class = TextSerializer

    def get_queryset(self):
        request: Any = self.request
        user: CustomUserModel = request.user

        return Text.objects.filter(creator=user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            data = self.perform_create(serializer)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        headers = self.get_success_headers(serializer.data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        request: Any = self.request
        user: CustomUserModel = request.user

        # For texts pasted or from pictures
        if "text" in serializer.validated_data:
            text = serializer.validated_data["text"]

            # Replace "fi-\nnish" by "finish"
            text = re.sub(r'(\w+)-\n(\w+)', r'\1\2', text)

            # Replace "I\nam" by "I am"
            text = re.sub(r'(\w+)\n(\w+)', r'\1 \2', text)

            language: Language = serializer.validated_data["language"]

            model = get_model_from_language(language.code)
            text, lemmas = split_text_with_spacy(text, model)

            serializer.save(
                text=text,
                lemmas=lemmas,
                has_finished_generation=True,
                creator=user,
                language=serializer.validated_data['language']
            )

        # For generation using AI
        if "subject" in serializer.validated_data:

            if user.credit < settings.GPT_API_CALL_COST:
                raise Exception(
                    "You don't have credit anymore. Please, contact us if you wish to use NeoTexto more."
                )

            length = serializer.validated_data.pop('length', 50)
            level = serializer.validated_data.pop('level', 'intermediate')

            text_object: Text = serializer.save(
                text=f"Your text about {serializer.validated_data['subject']} is being generated...",
                lemmas="",
                has_finished_generation=False,
                creator=user,
            )

            t = threading.Thread(
                target=ask_gpt_to_generate_a_text,
                args=[text_object, level, length],
                daemon=True
            )
            t.start()

        return serializer.data


class TranslationViewSet(
        mixins.CreateModelMixin,
        mixins.RetrieveModelMixin,
        mixins.ListModelMixin,
        mixins.DestroyModelMixin,
        viewsets.GenericViewSet):
    serializer_class = TranslationSerializer

    def get_queryset(self):
        return Translation.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            data = self.perform_create(serializer)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        headers = self.get_success_headers(data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        request: Any = self.request
        user: CustomUserModel = request.user

        if user.credit < settings.TRANSLATION_API_CALL_COST:
            raise Exception(
                "You don't have credit anymore. Please, contact us if you wish to use NeoTexto more."
            )

        word_to_translate = serializer.validated_data["word_source"]["word"]
        language_from = serializer.validated_data["word_source"]["language"]
        language_to = serializer.validated_data["word_target"]["language"]
        provider = serializer.validated_data["provider"] or "microsoft"

        if (not word_to_translate
            or not language_to
                or not language_from):
            raise Exception("Invalid API call.")

        if language_to == language_from:
            raise Exception(
                "The target language is the same as the source language. You may want to change your mother tongue in your profile."
            )

        # serializer.validated_data.word_source is the word we want to translate
        # serializer.validated_data.word_target contains the language we want to translate to
        filters = Q(
            word_source__word=word_to_translate,
            word_source__language=language_from,
            word_target__language=language_to,
            provider=provider,
        )

        translations = (
            Translation
            .objects
            .filter(filters)
            .select_related('word_source', 'word_target')
            .prefetch_related('example_set')
            .prefetch_related(
                Prefetch('usertranslation_set', queryset=UserTranslation.objects.filter(
                    user=user))
            )
        )

        if not translations:
            if provider == 'microsoft':
                translations = get_microsoft_translation(
                    word_to_translate,
                    language_from,
                    language_to
                )
            elif provider == 'yandex':
                translations = get_yandex_translation(
                    word_to_translate,
                    language_from,
                    language_to
                )
            elif provider == 'chatgpt':
                translations = get_chatgpt_translation(
                    word_to_translate,
                    language_from,
                    language_to
                )

        data = {
            "word": {
                "word": word_to_translate,
                "language": LanguageModelSerializer(language_from).data,
            },
            "translations": [
                TranslationSerializer(t).data
                for t in translations
            ]
        }

        for idx, t in enumerate(data["translations"]):
            examples = Example.objects.filter(translation=translations[idx])
            t["examples"] = [
                ExampleSerializer(e).data
                for e in examples
            ]

        user.credit -= settings.TRANSLATION_API_CALL_COST
        user.save()

        return data


@permission_classes([UserTranslationPermission])
class UserTranslationViewSet(
        mixins.CreateModelMixin,
        mixins.RetrieveModelMixin,
        mixins.ListModelMixin,
        mixins.DestroyModelMixin,
        viewsets.GenericViewSet):
    serializer_class = UserTranslationSerializer

    def get_queryset(self):
        request: Any = self.request
        user: CustomUserModel = request.user

        return UserTranslation.objects.filter(user=user)

    def perform_create(self, serializer):
        request: Any = self.request
        user: CustomUserModel = request.user

        serializer.save(
            user=user
        )


@permission_classes([UserPermission])
class UserViewSet(
        mixins.UpdateModelMixin,
        mixins.RetrieveModelMixin,
        viewsets.GenericViewSet):
    serializer_class = CustomUserModelSerializer

    def get_queryset(self):
        request: Any = self.request
        user: CustomUserModel = request.user
        return CustomUserModel.objects.filter(user_id=user.user_id)


class LanguageViewSet(
        mixins.RetrieveModelMixin,
        mixins.ListModelMixin,
        viewsets.GenericViewSet):
    serializer_class = LanguageModelSerializer

    def get_queryset(self):
        return Language.objects.all()


@api_view(['POST'])
def detect_text(request):
    user: CustomUserModel = request.user

    if user.credit < settings.IMAGE_API_CALL_COST:
        return JsonResponse({"error": "You don't have credit anymore. Please, contact us if you wish to use NeoTexto more."})

    imagefile = request.FILES.get('imagefile', '')

    if imagefile:
        content = imagefile.read()
    else:
        return JsonResponse({'error': 'No file'})

    client: Any = vision.ImageAnnotatorClient()
    image = vision.Image(content=content)

    response = client.text_detection(image=image)
    full_text_annotation = response.full_text_annotation

    detected_text = full_text_annotation.text

    # Replace "fi-\nnish" by "finish"
    detected_text = re.sub(r'(\w+)-\n(\w+)', r'\1\2', detected_text)
    # Replace "I\nam" by "I am"
    detected_text = re.sub(r'(\w+)\n(\w+)', r'\1 \2', detected_text)

    detected_language_code = (
        full_text_annotation
        .pages[0]
        .property
        .detected_languages[0]
        .language_code
    )

    user.credit -= settings.IMAGE_API_CALL_COST
    user.save()

    try:
        detected_language = Language.objects.get(code=detected_language_code)
    except Language.DoesNotExist:
        raise Exception(
            f"The language with code {detected_language_code} does not exist in our database.")

    if response.error.message:
        raise Exception(
            '{}\nFor more info on error messages, check: '
            'https://cloud.google.com/apis/design/errors'.format(
                response.error.message))

    return JsonResponse({
        "text": detected_text,
        "language": LanguageModelSerializer(detected_language).data,
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def contact(request):
    data = JSONParser().parse(request)
    serializer = ContactFormSerializer(data=data)
    if serializer.is_valid():
        try:
            send_mail(
                subject="Message from a user on NeoTexto",
                message=f"{data['email']} vous a écrit:\n\n{data['message']}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.EMAIL_HOST_USER],
                fail_silently=False,
            )
        except SMTPException:
            return JsonResponse({"error": "An error occured. The message could not be sent."})
    else:
        return JsonResponse(serializer.errors, status=400)

    return JsonResponse({"ok": "ok"})
