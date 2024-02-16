from django.test import TestCase

from api.models import Language, Word
from api.utils.translation import (
    get_dictionnary_examples,
    get_dictionnary_lookup,
    save_translate_result
)

TRANSLATION_RESULT = [
    {
        "translations": [
            {
                "text": "Halo, rafiki! Ulifanya nini leo?",
                "to": "es"
            }
        ]
    }
]

DICTIONNARY_LOOKUP_RESULT = [
    {
        "normalizedSource": "sunlight",
        "displaySource": "sunlight",
        "translations": [
            {
                "normalizedTarget": "luz solar",
                "displayTarget": "luz solar",
                "posTag": "NOUN",
                "confidence": 0.5313,
                "prefixWord": "",
                "backTranslations": [
                            {
                                "normalizedText": "sunlight",
                                "displayText": "sunlight",
                                "numExamples": 15,
                                "frequencyCount": 702
                            },
                    {
                                "normalizedText": "sunshine",
                                "displayText": "sunshine",
                                "numExamples": 7,
                                "frequencyCount": 27
                            },
                    {
                                "normalizedText": "daylight",
                                "displayText": "daylight",
                                "numExamples": 4,
                                "frequencyCount": 17
                            }
                ]
            },
            {
                "normalizedTarget": "rayos solares",
                "displayTarget": "rayos solares",
                "posTag": "NOUN",
                "confidence": 0.1544,
                "prefixWord": "",
                "backTranslations": [
                    {
                        "normalizedText": "sunlight",
                        "displayText": "sunlight",
                        "numExamples": 4,
                        "frequencyCount": 38
                    },
                    {
                        "normalizedText": "rays",
                        "displayText": "rays",
                        "numExamples": 11,
                        "frequencyCount": 30
                    },
                    {
                        "normalizedText": "sunrays",
                        "displayText": "sunrays",
                        "numExamples": 0,
                        "frequencyCount": 6
                    },
                    {
                        "normalizedText": "sunbeams",
                        "displayText": "sunbeams",
                        "numExamples": 0,
                        "frequencyCount": 4
                    }
                ]
            },
            {
                "normalizedTarget": "soleamiento",
                "displayTarget": "soleamiento",
                "posTag": "NOUN",
                "confidence": 0.1264,
                "prefixWord": "",
                "backTranslations": [
                    {
                        "normalizedText": "sunlight",
                        "displayText": "sunlight",
                        "numExamples": 0,
                        "frequencyCount": 7
                    }
                ]
            },
            {
                "normalizedTarget": "sol",
                "displayTarget": "sol",
                "posTag": "NOUN",
                "confidence": 0.1239,
                "prefixWord": "",
                "backTranslations": [
                    {
                        "normalizedText": "sun",
                        "displayText": "sun",
                        "numExamples": 15,
                        "frequencyCount": 20387
                    },
                    {
                        "normalizedText": "sunshine",
                        "displayText": "sunshine",
                        "numExamples": 15,
                        "frequencyCount": 1439
                    },
                    {
                        "normalizedText": "sunny",
                        "displayText": "sunny",
                        "numExamples": 15,
                        "frequencyCount": 265
                    },
                    {
                        "normalizedText": "sunlight",
                        "displayText": "sunlight",
                        "numExamples": 15,
                        "frequencyCount": 242
                    }
                ]
            },
            {
                "normalizedTarget": "insolación",
                "displayTarget": "insolación",
                "posTag": "NOUN",
                "confidence": 0.064,
                "prefixWord": "",
                "backTranslations": [
                    {
                        "normalizedText": "heat stroke",
                        "displayText": "heat stroke",
                        "numExamples": 3,
                        "frequencyCount": 67
                    },
                    {
                        "normalizedText": "insolation",
                        "displayText": "insolation",
                        "numExamples": 1,
                        "frequencyCount": 55
                    },
                    {
                        "normalizedText": "sunstroke",
                        "displayText": "sunstroke",
                        "numExamples": 2,
                        "frequencyCount": 31
                    },
                    {
                        "normalizedText": "sunlight",
                        "displayText": "sunlight",
                        "numExamples": 0,
                        "frequencyCount": 12
                    },
                    {
                        "normalizedText": "solarization",
                        "displayText": "solarization",
                        "numExamples": 0,
                        "frequencyCount": 7
                    },
                    {
                        "normalizedText": "sunning",
                        "displayText": "sunning",
                        "numExamples": 1,
                        "frequencyCount": 7
                    }
                ]
            }
        ]
    }
]

DICTIONNARY_EXAMPLES_RESULT = [
    {
        "normalizedSource": "sunlight",
        "normalizedTarget": "luz solar",
        "examples": [
            {
                "sourcePrefix": "You use a stake, silver, or ",
                "sourceTerm": "sunlight",
                "sourceSuffix": ".",
                "targetPrefix": "Se usa una estaca, plata, o ",
                "targetTerm": "luz solar",
                "targetSuffix": "."
            },
            {
                "sourcePrefix": "A pocket of ",
                "sourceTerm": "sunlight",
                "sourceSuffix": ".",
                "targetPrefix": "Una bolsa de ",
                "targetTerm": "luz solar",
                "targetSuffix": "."
            },
            {
                "sourcePrefix": "There must also be ",
                "sourceTerm": "sunlight",
                "sourceSuffix": ".",
                "targetPrefix": "También debe haber ",
                "targetTerm": "luz solar",
                "targetSuffix": "."
            },
            {
                "sourcePrefix": "We were living off of current ",
                "sourceTerm": "sunlight",
                "sourceSuffix": ".",
                "targetPrefix": "Estábamos viviendo de la ",
                "targetTerm": "luz solar",
                "targetSuffix": " actual."
            },
            {
                "sourcePrefix": "And they don't need unbroken ",
                "sourceTerm": "sunlight",
                "sourceSuffix": ".",
                "targetPrefix": "Y ellos no necesitan ",
                "targetTerm": "luz solar",
                "targetSuffix": " ininterrumpida."
            },
            {
                "sourcePrefix": "We have lamps that give the exact equivalent of ",
                "sourceTerm": "sunlight",
                "sourceSuffix": ".",
                "targetPrefix": "Disponemos de lámparas que dan el equivalente exacto de ",
                "targetTerm": "luz solar",
                "targetSuffix": "."
            },
            {
                "sourcePrefix": "Plants need water and ",
                "sourceTerm": "sunlight",
                "sourceSuffix": ".",
                "targetPrefix": "Las plantas necesitan agua y ",
                "targetTerm": "luz solar",
                "targetSuffix": "."
            },
            {
                "sourcePrefix": "So this requires ",
                "sourceTerm": "sunlight",
                "sourceSuffix": ".",
                "targetPrefix": "Así que esto requiere ",
                "targetTerm": "luz solar",
                "targetSuffix": "."
            },
            {
                "sourcePrefix": "And this pocket of ",
                "sourceTerm": "sunlight",
                "sourceSuffix": " freed humans from their ...",
                "targetPrefix": "Y esta bolsa de ",
                "targetTerm": "luz solar",
                "targetSuffix": ", liberó a los humanos de ..."
            },
            {
                "sourcePrefix": "Since there is no ",
                "sourceTerm": "sunlight",
                "sourceSuffix": ", the air within ...",
                "targetPrefix": "Como no hay ",
                "targetTerm": "luz solar",
                "targetSuffix": ", el aire atrapado en ..."
            },
            {
                "sourcePrefix": "The ",
                "sourceTerm": "sunlight",
                "sourceSuffix": " shining through the glass creates a ...",
                "targetPrefix": "La ",
                "targetTerm": "luz solar",
                "targetSuffix": " a través de la vidriera crea una ..."
            },
            {
                "sourcePrefix": "Less ice reflects less ",
                "sourceTerm": "sunlight",
                "sourceSuffix": ", and more open ocean ...",
                "targetPrefix": "Menos hielo refleja menos ",
                "targetTerm": "luz solar",
                "targetSuffix": ", y más mar abierto ..."
            },
            {
                "sourcePrefix": "",
                "sourceTerm": "Sunlight",
                "sourceSuffix": " is most intense at midday, so ...",
                "targetPrefix": "La ",
                "targetTerm": "luz solar",
                "targetSuffix": " es más intensa al mediodía, por lo que ..."
            },
            {
                "sourcePrefix": "... capture huge amounts of ",
                "sourceTerm": "sunlight",
                "sourceSuffix": ", so fueling their growth.",
                "targetPrefix": "... capturan enormes cantidades de ",
                "targetTerm": "luz solar",
                "targetSuffix": " que favorecen su crecimiento."
            },
            {
                "sourcePrefix": "... full height, giving more direct ",
                "sourceTerm": "sunlight",
                "sourceSuffix": " in the winter.",
                "targetPrefix": "... altura completa, dando más ",
                "targetTerm": "luz solar",
                "targetSuffix": " directa durante el invierno."
            }
        ]
    }
]


class TranslationTestCase(TestCase):

    def setUp(self):
        self.language_from = Language.objects.create(
            name="English",
            code="en"
        )
        self.language_to = Language.objects.create(
            name="Spanish",
            code="es"
        )

    def test_get_translation(self):

        found_results = get_dictionnary_lookup(
            DICTIONNARY_LOOKUP_RESULT[0], self.language_from, self.language_to)

        self.assertEquals(found_results[0].word_source.word, "sunlight")
        self.assertEquals(found_results[0].word_source.language.code, "en")
        self.assertEquals(found_results[0].word_target.word, "luz solar")
        self.assertEquals(found_results[0].word_target.language.code, "es")

        self.assertEquals(found_results[1].word_source.word, "sunlight")
        self.assertEquals(found_results[1].word_source.language.code, "en")
        self.assertEquals(found_results[1].word_target.word, "rayos solares")
        self.assertEquals(found_results[1].word_target.language.code, "es")

        self.assertEquals(found_results[2].word_source.word, "sunlight")
        self.assertEquals(found_results[2].word_source.language.code, "en")
        self.assertEquals(found_results[2].word_target.word, "soleamiento")
        self.assertEquals(found_results[2].word_target.language.code, "es")

        self.assertEquals(found_results[3].word_source.word, "sunlight")
        self.assertEquals(found_results[3].word_source.language.code, "en")
        self.assertEquals(found_results[3].word_target.word, "sol")
        self.assertEquals(found_results[3].word_target.language.code, "es")

        self.assertEquals(found_results[4].word_source.word, "sunlight")
        self.assertEquals(found_results[4].word_source.language.code, "en")
        self.assertEquals(found_results[4].word_target.word, "insolación")
        self.assertEquals(found_results[4].word_target.language.code, "es")

    def test_get_examples(self):
        translations = get_dictionnary_lookup(
            DICTIONNARY_LOOKUP_RESULT[0],
            self.language_from,
            self.language_to
        )

        found_results = get_dictionnary_examples(
            DICTIONNARY_EXAMPLES_RESULT,
            translations[:1]
        )

        self.assertEquals(found_results[0].translation.pk, translations[0].id)
        self.assertEquals(
            found_results[0].source_prefix,
            "You use a stake, silver, or "
        )
        self.assertEquals(found_results[0].source_term, "sunlight")
        self.assertEquals(found_results[0].source_suffix, ".")
        self.assertEquals(
            found_results[0].target_prefix,
            "Se usa una estaca, plata, o "
        )
        self.assertEquals(found_results[0].target_term, "luz solar")
        self.assertEquals(found_results[0].target_suffix, ".")

        self.assertEquals(len(found_results), 15)
        self.assertEquals(translations[0].example_set.count(), 15)

    def test_get_group_translation(self):
        word_source = "Hello, friend! What did you do today?"
        translations = save_translate_result(
            TRANSLATION_RESULT[0],
            self.language_from,
            self.language_to,
            word_source
        )

        self.assertEquals(len(translations), 1)
        self.assertEquals(translations[0].word_source.word, word_source)
        self.assertEquals(
            translations[0].word_source.language,
            self.language_from
        )
        self.assertEquals(
            translations[0].word_target.word,
            "Halo, rafiki! Ulifanya nini leo?"
        )
        self.assertEquals(
            translations[0].word_target.language,
            self.language_to
        )
