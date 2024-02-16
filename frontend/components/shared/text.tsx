"use client";

import { useDefinitionContext } from "@/app/providers/definition-provider";
import { useGeneratedTexts } from "@/app/providers/generated-texts-provider";
import { useToastContext } from "@/app/providers/toast-provider";
import { useUserContext } from "@/app/providers/user-provider";
import useAxiosAuth from "@/lib/hooks/use-axios-auth";
import {
  DefinitionInterface,
  TextInterface,
  TranslationProvider,
  UserTranslationInterface,
} from "@/types/types";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import CloseIcon from "../icons/close";

export default function Text() {
  const { idxTextFocusedOn, generatedTexts } = useGeneratedTexts();
  const {
    definitionAreaIsVisible,
    indexesWordFocused,
    userTranslations,
    translationProvider,
    setDefinitionAreaIsVisible,
    setDefinitionContext,
    setIndexesWordFocused,
    setUserTranslations,
    setDefinitionAreaIsLoading,
    setTranslationProvider,
    setTranslationLanguage,
  } = useDefinitionContext();
  const { user, setUser } = useUserContext();
  const axiosPublic = useAxiosAuth();
  const {
    setToastCategory,
    setToastMessage,
    setToastPosition,
    setToastTitle,
    setShowToast,
    setToastDuration,
  } = useToastContext();

  const displayedText: TextInterface = generatedTexts.filter(
    (text) => text.id == idxTextFocusedOn,
  )[0];

  let textLanguage: string | null = null;
  let listOfWords: string[] = [];
  let listOfLemmas: string[] = [];
  let listOfUserTranslationsInThisText: UserTranslationInterface[] = [];

  if (displayedText) {
    textLanguage = displayedText.language.name;
    listOfWords = displayedText.text.split(/_\$_/g);
    listOfLemmas = displayedText.lemmas.split(/_\$_/g);
    listOfUserTranslationsInThisText = userTranslations.filter((ut) =>
      listOfLemmas.includes(ut.translation.wordSource.word),
    );
  }

  const getTranslation = async (text: TextInterface, word: string) => {
    setDefinitionAreaIsLoading(true);
    setDefinitionContext({
      word: {
        word: word,
        language: text.language,
      },
      translations: [],
    });

    if (!definitionAreaIsVisible) {
      setDefinitionAreaIsVisible(true);
    }

    if (!translationProvider) {
      setTranslationProvider(TranslationProvider.Microsoft);
    }

    try {
      const res = await axiosPublic.post("/back/api/translations/", {
        wordSource: {
          word,
          language: text.language.id,
        },
        wordTarget: {
          word: "null",
          language: user?.motherTongue.id,
        },
        provider: translationProvider?.toLowerCase(),
      });

      const definition: DefinitionInterface = await res.data;

      if (definition) {
        if (user) {
          user.credit -= Number(process.env.TRANSLATE_API_CALL_COST) || 1;
          setUser({ ...user });
        }

        if (definition.translations.length > 0) {
          let provider;

          switch (definition.translations[0].provider) {
            case "chatgpt":
              provider = TranslationProvider.ChatGPT;
              break;
            case "microsoft":
              provider = TranslationProvider.Microsoft;
              break;
            case "yandex":
              provider = TranslationProvider.Yandex;
              break;
          }

          setTranslationProvider(provider);
          setTranslationLanguage(
            definition.translations[0].wordTarget.language,
          );
        }

        setDefinitionContext(definition);
      } else {
        throw res.data;
      }
    } catch (e: any) {
      setToastCategory("error");
      setToastTitle("Error");
      setToastPosition("bottom-right");
      setToastDuration(5000);

      if (
        e.response?.data?.wordSource?.word.includes(
          "Ensure this field has no more than 80 characters.",
        )
      ) {
        setToastMessage("The text you selected has more than 80 characters.");
        setDefinitionAreaIsVisible(false);
      } else if (e.response?.data?.error) {
        setToastMessage(e.response.data.error);
      } else {
        setToastMessage("An error occured.");
      }

      setShowToast(true);
    }
    setDefinitionAreaIsLoading(false);
  };

  const handleClick = async (text: TextInterface, i: number) => {
    const selection = window.getSelection()?.toString().trim();

    if (selection === "") {
      setIndexesWordFocused([i]);
      if (listOfLemmas[i]) {
        await getTranslation(text, listOfLemmas[i]);
      } else if (listOfWords[i]) {
        await getTranslation(text, listOfWords[i]);
      }
    }
  };

  const range = (size: number, startAt = 0) => {
    return Array.from(Array(size).keys()).map((i) => i + startAt);
  };

  const handleMouseUp = async (text: TextInterface) => {
    const selection = window.getSelection();
    const selectionString = selection?.toString().trim();

    const anchorNodeParent = selection?.anchorNode?.parentNode as HTMLElement;
    const indexAnchor = parseInt(
      anchorNodeParent?.getAttribute("index-in-list") || "0",
    );

    const focusNodeParent = selection?.focusNode?.parentNode as HTMLElement;
    const indexFocus = parseInt(
      focusNodeParent?.getAttribute("index-in-list") || "0",
    );

    const indexBeginning = Math.min(indexAnchor, indexFocus);
    const indexEnding = Math.max(indexAnchor, indexFocus);

    if (selectionString !== "") {
      setIndexesWordFocused(
        range(indexEnding - indexBeginning + 1, indexBeginning),
      );
      const groupOfWords = listOfWords
        .slice(indexBeginning, indexEnding + 1)
        .join(" ");
      await getTranslation(text, groupOfWords);
    }
  };

  const deleteWord = async (userTranslation: UserTranslationInterface) => {
    try {
      const res = await axiosPublic.delete(
        `/back/api/user-translations/${userTranslation.id}/`,
      );

      if (res.status == 204) {
        setUserTranslations(
          userTranslations.filter((ut) => userTranslation.id != ut.id),
        );

        setToastCategory("success");
        setToastTitle("Success !");
        setToastDuration(3000);
        setToastPosition("bottom-right");
        setToastMessage(
          `The following word was removed from your list of vocabulary: ${userTranslation.translation.wordSource.word} (${userTranslation.translation.wordTarget.word})`,
        );
        setShowToast(true);
      }
    } catch (e) {
      setToastCategory("error");
      setToastTitle("Error");
      setToastDuration(3000);
      setToastPosition("bottom-right");
      setToastMessage(
        "An error occured. This word could not be removed from your list of vocabulary.",
      );
      setShowToast(true);
    }
  };

  return (
    <div className="min-h-full w-full">
      {displayedText && (
        <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center py-20">
          <div className="w-full rounded-md bg-white text-gray-700 shadow-md">
            <p
              onMouseUp={(e) => handleMouseUp(displayedText)}
              onTouchEnd={(e) => handleMouseUp(displayedText)}
              className="break-words p-4 text-base leading-7"
            >
              {listOfWords &&
                listOfWords.map((word, i) => {
                  const wordWithoutWhiteSpace = word.replace(/\s$/g, "");
                  const ws = word.match(/\s$/g);
                  return (
                    <span
                      key={i}
                      onClick={() => handleClick(displayedText, i)}
                      className="whitespace-pre-line"
                    >
                      <span
                        index-in-list={i}
                        className={
                          indexesWordFocused.includes(i) ? "underline" : ""
                        }
                      >
                        {wordWithoutWhiteSpace}
                      </span>
                      {ws}
                    </span>
                  );
                })}
            </p>
          </div>

          <p className="p-2 text-right text-[10px] text-gray-400">
            Language: {textLanguage}
          </p>

          {listOfUserTranslationsInThisText.length > 0 && (
            <Accordion.Root
              className="mt-10 flex flex-col gap-y-4 rounded-md shadow-sm hover:shadow-md"
              type="single"
              collapsible
            >
              <Accordion.Item
                className="mt-px overflow-hidden rounded-md border-b border-gray-200 first:mt-0 first:rounded-t last:rounded-b"
                value="x"
              >
                <Accordion.Header className="flex shadow-[0_1px_0]">
                  <Accordion.Trigger className="group flex h-[45px] flex-1 cursor-default items-center justify-between px-5 text-[15px] leading-none outline-none">
                    <span>Remove the words in this text from your list</span>
                    <ChevronDownIcon
                      className="transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180"
                      aria-hidden
                    />
                  </Accordion.Trigger>
                </Accordion.Header>

                <Accordion.Content className="overflow-hidden p-1 text-[15px] data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
                  <ul className="w-full list-disc">
                    {listOfUserTranslationsInThisText.map(
                      (userTranslation, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between rounded px-4 py-2 hover:bg-amber-100"
                        >
                          <div className="">
                            <p>{userTranslation.translation.wordSource.word}</p>
                            <p className="italic">
                              {userTranslation.translation.wordTarget?.word}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              deleteWord(userTranslation);
                            }}
                            aria-label="Close mobile menu"
                            data-testid="close-mobile-menu"
                            className="hover:scale-110"
                          >
                            <CloseIcon className="h-4" />
                          </button>
                        </li>
                      ),
                    )}
                  </ul>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          )}
        </div>
      )}
    </div>
  );
}
