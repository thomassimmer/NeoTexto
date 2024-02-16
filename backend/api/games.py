import os

from django.conf import settings
from django.http import JsonResponse
from openai import OpenAI
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny

from api.models import CustomUserModel, Language, Translation
from api.serializers import CreateSentenceGameSerializer


@api_view(['POST'])
@permission_classes([AllowAny])  # TODO: Security
def create_sentence(request):
    data = JSONParser().parse(request)
    serializer = CreateSentenceGameSerializer(data=data)

    if serializer.is_valid():

        user: CustomUserModel = request.user
        user.credit -= settings.TRANSLATION_API_CALL_COST
        user.save()

        if isinstance(serializer.validated_data, dict):
            language: Language = (
                serializer
                .validated_data
                .get("language", None)
            )
            sentence: str = serializer.validated_data.get("sentence", None)
            translation: Translation = (
                serializer
                .validated_data
                .get("translation", None)
            )

            word_source_language = ""
            if translation.word_source.language:
                word_source_language = f"in {translation.word_source.language.name}"

            prompt = f"""Answer to me in {language.name}. 
If the following sentence [[{sentence}]] is correct{word_source_language} 
and is a right use of the word [[{translation.word_source.word} / 
{translation.word_target.word}]], tell me briefly that I am correct, otherwise 
explain why not."""

            client = OpenAI(
                organization=os.environ.get("OPENAI_ORGANIZATION"),
                api_key=os.environ.get("OPENAI_API_KEY")
            )

            result = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": prompt}
                ],
                max_tokens=2048,
            )
            try:
                answer = result.choices[0].message.content
            except:
                # TODO
                pass

            return JsonResponse({"answer": answer})

    return JsonResponse(serializer.errors, status=400)
