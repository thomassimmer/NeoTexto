import os
import re
from typing import Optional

import spacy
from django.conf import settings
from openai import OpenAI

from api.models import Text, UserTranslation

WORD_SEPARATOR = "_$_"


def split_text_with_spacy(generated_text: str, model: Optional[str]):
    if model:
        try:
            nlp = spacy.load(model)
            doc = nlp(generated_text)
            lemmas = (
                WORD_SEPARATOR
                .join([token.lemma_ for token in doc])
            )
            text = (
                WORD_SEPARATOR
                .join([token.text_with_ws for token in doc])
            )

        except Exception:
            text = lemmas = re.sub(
                pattern=r'(\W+)',
                repl=WORD_SEPARATOR + r'\1' + WORD_SEPARATOR,
                string=generated_text
            )

    else:
        text = lemmas = re.sub(
            pattern=r'(\W+)',
            repl=WORD_SEPARATOR + r'\1' + WORD_SEPARATOR,
            string=generated_text
        )

    return text, lemmas


def ask_gpt_to_generate_a_text(text_object: Text, level: str, length: str):
    list_of_words_to_use = (
        UserTranslation
        .objects
        .filter(
            user=text_object.creator,
            translation__word_source__language=text_object.language
        )
        .values_list("translation__word_source__word", flat=True)
        .distinct()
        [:20]
    )

    language_name = "english"
    if text_object.language:
        language_name = text_object.language.name

    prompt = (
        f"Generate a text of {length} words in {language_name}"
    )

    subject = text_object.subject
    if not subject:
        subject = "anything"

    prompt += f" about '{subject}'"
    prompt += f" for a {level} level."

    if list_of_words_to_use:
        prompt += (
            f" Use the five most relevant words from this list : {', '.join(list_of_words_to_use)}."
        )

    # To debug without calling OpenAi API, comment this
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
    generatedText = result.choices[0].message.content or ""

    if text_object.creator:
        text_object.creator.credit -= settings.GPT_API_CALL_COST
        text_object.creator.save()

    # And uncomment this
    # generatedText = "..."

    language_code = "en"
    if text_object.language:
        language_code = text_object.language.code

    model = get_model_from_language(language_code)
    text, lemmas = split_text_with_spacy(generatedText, model)

    text_object.text = text
    text_object.lemmas = lemmas
    text_object.has_finished_generation = True
    text_object.save()


def get_model_from_language(language_code):
    try:
        if language_code == "fr":
            return "fr_core_news_lg"
        if language_code == "en":
            return "en_core_web_lg"
        if language_code == "ru":
            return "ru_core_news_lg"
        if language_code == "de":
            return "de_core_news_lg"
        if language_code == "ja":
            return "ja_core_news_lg"
        if language_code == "zh":
            return "zh_core_web_lg"
        if language_code == "it":
            return "it_core_news_lg"
        if language_code == "pt":
            return "pt_core_news_lg"

    except Exception:
        pass
    return None
