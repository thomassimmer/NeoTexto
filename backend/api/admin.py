from django.contrib import admin

from .models import (
    CustomUserModel,
    Example,
    Language,
    Text,
    Translation,
    UserTranslation,
    Word
)

admin.site.register(CustomUserModel)
admin.site.register(Text)
admin.site.register(Word)
admin.site.register(Translation)
admin.site.register(UserTranslation)
admin.site.register(Example)
admin.site.register(Language)
