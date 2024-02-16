import json
import os
import uuid
from typing import List

import requests
from django.conf import settings
from openai import OpenAI

from api.models import Example, Language, Translation, Word

ENDPOINT = "https://api.cognitive.microsofttranslator.com"
HEADERS = {
    'Ocp-Apim-Subscription-Key': settings.MICROSOFT_TRANSLATION_API_KEY,
    'Ocp-Apim-Subscription-Region': "northeurope",
    'Content-type': 'application/json',
    'X-ClientTraceId': str(uuid.uuid4())
}


def get_chatgpt_translation(word, language_from: Language, language_to: Language):

    prompt = f"""Translate the {language_from.name} word [[{word}]] in {language_to.name}.
There can be several translations but a maximum of 3. Each translation should have an example.
Your output must consist only of a JSON object where each key is a translation in {language_to.name} without any article,
and each value is a dictionnary with inside a key \"source\" and a value that is an example in {language_from.name},
and a key \"target\" and a value that is an example in {language_to.name}."""

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

    answer = result.choices[0].message.content or ""
    translations = []

    try:
        answer = json.loads(answer)

        word_source, _ = (
            Word
            .objects
            .select_related("language")
            .get_or_create(
                word=word,
                language=language_from
            )
        )

        for tr, example in answer.items():
            word_target, _ = (
                Word
                .objects
                .select_related('language')
                .get_or_create(
                    word=tr,
                    language=language_to
                )
            )
            translation, _ = (
                Translation
                .objects
                .select_related(
                    'word_source',
                    'word_source__language',
                    'word_target',
                    'word_target__language'
                )
                .get_or_create(
                    word_source=word_source,
                    word_target=word_target,
                    provider="chatgpt"
                )
            )

            if example:
                examples = []
                examples.append(
                    Example(
                        translation=translation,
                        source_prefix="",
                        source_term=example["source"],
                        source_suffix="",
                        target_prefix="",
                        target_term=example["target"],
                        target_suffix="",
                    )
                )

                examples = Example.objects.bulk_create(examples)
                translation.refresh_from_db()

            translations.append(translation)
        return translations

    except Exception:
        raise Exception("ChatGPT did not work for this translation.")


def get_yandex_translation(word, language_from: Language, language_to: Language):

    # TODO
    if language_from.code == "zh" or language_to.code == "zh":
        raise Exception(
            "Sorry, we don't have translations between these two languages yet."
        )

    translations = []
    is_a_group_of_word = len(word.split(" ")) > 1

    if is_a_group_of_word:
        pass
    else:
        url = (
            f"https://dictionary.yandex.net/api/v1/dicservice.json/lookup?"
            f"key={settings.YANDEX_DICTIONNARY_API_KEY}&"
            f"lang={language_from.code}-{language_to.code}&"
            f"text={word}"
        )
        request = requests.get(url)
        result = request.json()

        if request.status_code == 200:

            if result and "def" in result and result["def"]:
                definition = result["def"][0]

                if "text" in definition:
                    word_source, _ = (
                        Word
                        .objects
                        .select_related("language")
                        .get_or_create(
                            word=definition["text"],
                            language=language_from
                        )
                    )

                if "tr" in definition:
                    for tr in definition["tr"]:
                        word_target, _ = (
                            Word
                            .objects
                            .select_related('language')
                            .get_or_create(
                                word=tr["text"],
                                language=language_to
                            )
                        )
                        translation, _ = (
                            Translation
                            .objects
                            .select_related(
                                'word_source',
                                'word_source__language',
                                'word_target',
                                'word_target__language'
                            )
                            .get_or_create(
                                word_source=word_source,
                                word_target=word_target,
                                provider="yandex"
                            )
                        )

                        if "ex" in tr:
                            examples = []
                            for example in tr["ex"]:
                                examples.append(
                                    Example(
                                        translation=translation,
                                        source_prefix="",
                                        source_term=example["text"],
                                        source_suffix="",
                                        target_prefix="",
                                        target_term=example["tr"][0]["text"],
                                        target_suffix="",
                                    )
                                )

                            examples = Example.objects.bulk_create(examples)
                            translation.refresh_from_db()

                        translations.append(translation)
            return translations

        elif request.status_code == 501:
            raise Exception(
                "Sorry, we don't have translations between these two languages yet."
            )
        else:
            raise Exception("An error occured.")

    return translations


def get_microsoft_translation(word, language_from: Language, language_to: Language):

    translations = []
    is_a_group_of_word = len(word.split(" ")) > 1

    if is_a_group_of_word:
        result = make_translate_request(
            word,
            language_from,
            language_to
        )

        if ("error" in result
            and "code" in result["error"]
                and result["error"]["code"] == 400023):
            return []

        translations = save_translate_result(
            result[0],
            language_from,
            language_to,
            word,
        )

    else:
        result = make_dictionnary_lookup_request(
            word,
            language_from,
            language_to
        )

        if ("error" in result
            and "code" in result["error"]
                and result["error"]["code"] == 400023):
            return []

        translations = get_dictionnary_lookup(
            result[0],
            language_from,
            language_to
        )
        result = make_dictionnary_examples_request(
            translations,
            language_from,
            language_to
        )
        get_dictionnary_examples(result, translations)

    return translations


def make_translate_request(word, language_from: Language, language_to: Language):
    path = '/translate'
    constructed_url = ENDPOINT + path

    body = [{
        'text': word
    }]

    params = {
        'api-version': '3.0',
        'from': language_from.code,
        'to': language_to.code
    }

    request = requests.post(
        constructed_url,
        params=params,
        headers=HEADERS,
        json=body
    )
    return request.json()


def save_translate_result(json, language_from, language_to: Language, word_source):
    translations = []

    if json:
        if word_source:
            word_source, _ = (
                Word
                .objects
                .select_related('language')
                .get_or_create(
                    word=word_source, language=language_from)
            )

        if "translations" in json:
            for translation in json["translations"]:
                word_target, _ = (
                    Word
                    .objects
                    .select_related('language')
                    .get_or_create(
                        word=translation["text"],
                        language=language_to
                    )
                )
                translation, _ = (
                    Translation
                    .objects
                    .select_related(
                        'word_source',
                        'word_source__language',
                        'word_target',
                        'word_target__language'
                    )
                    .get_or_create(
                        word_source=word_source,
                        word_target=word_target,
                        provider="microsoft"
                    )
                )
                translations.append(translation)

    return translations


def make_dictionnary_lookup_request(word, language_from: Language, language_to: Language):
    path = '/dictionary/lookup'
    constructed_url = ENDPOINT + path

    body = [{
        'text': word
    }]

    params = {
        'api-version': '3.0',
        'from': language_from.code,
        'to': language_to.code
    }

    request = requests.post(
        constructed_url,
        params=params,
        headers=HEADERS,
        json=body
    )
    return request.json()


def get_dictionnary_lookup(json, language_from: Language, language_to: Language):
    translations = []

    if json:
        if "normalizedSource" in json:
            word_source, _ = (
                Word
                .objects
                .select_related('language')
                .get_or_create(
                    word=json["normalizedSource"],
                    language=language_from
                )
            )

        if "translations" in json:
            for translation in json["translations"]:
                word_target, _ = (
                    Word
                    .objects
                    .select_related("language")
                    .get_or_create(
                        word=translation["normalizedTarget"],
                        language=language_to
                    )
                )

                translation, _ = (
                    Translation
                    .objects
                    .select_related(
                        'word_source',
                        'word_source__language',
                        'word_target',
                        'word_target__language'
                    )
                    .get_or_create(
                        word_source=word_source,
                        word_target=word_target,
                        provider="microsoft"
                    )
                )

                translations.append(translation)

    return translations


def make_dictionnary_examples_request(translations: List[Translation], language_from: Language, language_to: Language):
    path = '/dictionary/examples'
    constructed_url = ENDPOINT + path

    body = []
    params = {
        'api-version': '3.0',
        'from': language_from.code,
        'to': language_to.code
    }

    for translation in translations:
        body.append({
            "text": translation.word_source.word,
            "translation": translation.word_target.word
        })

    if body:
        request = requests.post(
            constructed_url, params=params, headers=HEADERS, json=body)
        return request.json()

    return {}


def get_dictionnary_examples(json, translations: List[Translation]) -> List[Example]:
    examples = []

    if json:
        for i, translation in enumerate(translations):
            examples = []

            if "examples" in json[i]:
                for example in json[i]["examples"]:
                    examples.append(
                        Example(
                            translation=translation,
                            source_prefix=example["sourcePrefix"],
                            source_term=example["sourceTerm"],
                            source_suffix=example["sourceSuffix"],
                            target_prefix=example["targetPrefix"],
                            target_term=example["targetTerm"],
                            target_suffix=example["targetSuffix"],
                        )
                    )

                examples = Example.objects.bulk_create(examples)
                translation.refresh_from_db()

    return examples
