from django.db import IntegrityError

from api.models import Language
from api.utils.accepted_languages import ACCEPTED_LANGUAGES_FOR_IMAGE_TO_TEXT

for name, code in ACCEPTED_LANGUAGES_FOR_IMAGE_TO_TEXT.items():
    try:
        Language.objects.get_or_create(
            name=name,
            code=code,
        )
    except IntegrityError:
        pass

print("Languages have been generated.")