from rest_framework.serializers import (
    BooleanField,
    CharField,
    ChoiceField,
    EmailField,
    ModelSerializer,
    PrimaryKeyRelatedField,
    Serializer
)

from .models import (
    TRANSLATION_PROVIDERS,
    CustomUserModel,
    Example,
    Language,
    Text,
    Translation,
    UserTranslation,
    Word
)


class LanguageModelSerializer(ModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'
        validators = []


class CustomUserModelSerializer(ModelSerializer):
    class Meta:
        model = CustomUserModel
        fields = [
            "user_id",
            "email",
            "has_finished_intro",
            "image",
            "mother_tongue",
            "credit",
        ]
        read_only_fields = ["credit"]

    def to_representation(self, obj):
        ret = super().to_representation(obj)
        if obj.image and obj.image.url:
            ret['image'] = obj.image.url
        if obj.mother_tongue:
            ret['mother_tongue'] = LanguageModelSerializer(
                obj.mother_tongue).data
        return ret


class TextSerializer(ModelSerializer):
    topic_should_be_random = BooleanField(required=False)
    level = ChoiceField(required=False, allow_blank=False, choices=[
                        "beginner", "intermediate", "advanced", "mastery"])
    length = ChoiceField(required=False, allow_blank=False,
                         choices=['50', '200', '400'])

    class Meta:
        model = Text
        fields = '__all__'

    def to_representation(self, obj):
        ret = super().to_representation(obj)
        if obj.language:
            ret['language'] = (
                LanguageModelSerializer(obj.language)
                .data
            )
        return ret


class WordSerializer(ModelSerializer):
    class Meta:
        model = Word
        fields = '__all__'
        validators = []

    def to_representation(self, obj):
        ret = super().to_representation(obj)
        if obj.language:
            ret['language'] = (
                LanguageModelSerializer(obj.language)
                .data
            )
        return ret


class TranslationSerializer(ModelSerializer):
    word_source = WordSerializer()
    word_target = WordSerializer()
    provider = ChoiceField(TRANSLATION_PROVIDERS,
                           allow_null=True, default='microsoft')

    class Meta:
        model = Translation
        fields = '__all__'
        validators = []


class ExampleSerializer(ModelSerializer):
    class Meta:
        model = Example
        fields = '__all__'


class UserTranslationSerializer(ModelSerializer):
    class Meta:
        model = UserTranslation
        fields = ['id', 'translation']

    def to_representation(self, obj):
        ret = super().to_representation(obj)
        if obj.translation:
            ret['translation'] = TranslationSerializer(
                obj.translation).data
        return ret


class ContactFormSerializer(Serializer):
    email = EmailField(max_length=None, min_length=None, allow_blank=False)
    message = CharField(required=False, allow_blank=False, max_length=200)


class CreateSentenceGameSerializer(Serializer):
    sentence = CharField(allow_blank=False, max_length=200)
    language = PrimaryKeyRelatedField(queryset=Language.objects.all())
    translation = PrimaryKeyRelatedField(queryset=Translation.objects.all())
