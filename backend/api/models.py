from uuid import uuid4

from django.conf import settings
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin
)
from django.db import models

TRANSLATION_PROVIDERS = (
    ("microsoft", "Microsoft"),
    ("yandex", "Yandex"),
    ("chatgpt", "ChatGPT"),
)


class Language(models.Model):
    name = models.TextField(max_length=100, null=False, blank=False)
    code = models.TextField(max_length=5, null=False, blank=False)

    class Meta:
        unique_together = ["name", "code"]


class CustomUserModelManager(BaseUserManager):
    def create_user(self, username, email, password=None):
        user = self.model(
            username=username,
            email=self.normalize_email(email),
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, username, email, password):
        user = self.create_user(
            username,
            email,
            password=password
        )

        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class CustomUserModel(AbstractBaseUser, PermissionsMixin):
    user_id = models.UUIDField(
        max_length=16, default=uuid4, primary_key=True, editable=False, unique=True)
    username = models.TextField(
        max_length=16, unique=True, null=False, blank=False)
    email = models.EmailField(
        max_length=100, unique=True, null=False, blank=False)
    image = models.ImageField(upload_to=f'images', null=True, blank=True)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    is_active = models.BooleanField(default=True)

    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    created_on = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserModelManager()

    has_finished_intro = models.BooleanField(
        default=False, blank=True, null=True)
    mother_tongue = models.ForeignKey(
        Language, on_delete=models.SET_NULL, null=True)
    credit = models.IntegerField(
        null=True, default=settings.USER_INITIAL_CREDIT)

    class Meta:
        verbose_name = "Custom User"


class Text(models.Model):
    subject = models.TextField(max_length=200, null=True, blank=True)
    text = models.TextField(max_length=10000, null=True, blank=True)
    lemmas = models.TextField(max_length=10000, null=True, blank=True)
    has_finished_generation = models.BooleanField(default=False)
    language = models.ForeignKey(
        Language, on_delete=models.SET_NULL, null=True)
    creator = models.ForeignKey(
        CustomUserModel, on_delete=models.CASCADE, null=True)


class Word(models.Model):
    language = models.ForeignKey(
        Language, on_delete=models.SET_NULL, null=True)
    word = models.TextField(max_length=80, null=False, blank=False)

    class Meta:
        unique_together = ["language", "word"]


class Translation(models.Model):
    word_source = models.ForeignKey(
        Word, on_delete=models.CASCADE, related_name='word_source')
    word_target = models.ForeignKey(
        Word, on_delete=models.CASCADE, related_name='word_target')
    provider = models.CharField(
        max_length=20, choices=TRANSLATION_PROVIDERS, default='microsoft')

    class Meta:
        unique_together = ["word_source", "word_target", "provider"]


class Example(models.Model):
    translation = models.ForeignKey(Translation, on_delete=models.CASCADE)
    source_prefix = models.TextField(max_length=100, default="")
    source_term = models.TextField(max_length=100, default="")
    source_suffix = models.TextField(max_length=100, default="")
    target_prefix = models.TextField(max_length=100, default="")
    target_term = models.TextField(max_length=100, default="")
    target_suffix = models.TextField(max_length=100, default="")

    # TODO: Do we need a unique constraint ? Not sure because we creates
    # examples only if no Translation exist.


class UserTranslation(models.Model):
    translation = models.ForeignKey(Translation, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUserModel, on_delete=models.CASCADE)
