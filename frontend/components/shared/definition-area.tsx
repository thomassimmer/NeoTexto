"use client";

import { useDefinitionContext } from "@/app/providers/definition-provider";
import { useLanguageContext } from "@/app/providers/language-provider";
import { useToastContext } from "@/app/providers/toast-provider";
import { useUserContext } from "@/app/providers/user-provider";
import { axiosPublic } from "@/lib/axios";
import { DefinitionInterface } from "@/types/types";
import * as Accordion from "@radix-ui/react-accordion";
import * as Form from "@radix-ui/react-form";
import { CheckIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";
import * as Separator from "@radix-ui/react-separator";
import classnames from "classnames";
import Link from "next/link";
import { LoadingCircle } from "../icons";
import LanguageSelector from "./language-selector";
import ProviderSelector from "./provider-selector";
import TranslationItem from "./translation-item";

export function SelectItem({ children, value, ...props }) {
  return (
    <Select.Item
      className={classnames(
        "text-violet11 data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none",
        props.className,
      )}
      value={value}
      {...props}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
}

export default function DefinitionArea() {
  const {
    definitionAreaIsVisible,
    definitionContext,
    definitionAreaIsLoading,
    translationProvider,
    translationLanguage,
    setDefinitionContext,
    setDefinitionAreaIsLoading,
    setTranslationProvider,
    setTranslationLanguage,
  } = useDefinitionContext();
  const {
    setToastCategory,
    setToastMessage,
    setToastPosition,
    setToastTitle,
    setShowToast,
    setToastDuration,
  } = useToastContext();
  const { user, setUser } = useUserContext();
  const { textLanguage } = useLanguageContext();

  if (!definitionAreaIsVisible || definitionContext == null) {
    return null;
  }

  const getTranslation = async () => {
    setDefinitionAreaIsLoading(true);

    try {
      const res = await axiosPublic.post("/back/api/translations/", {
        wordSource: {
          word: definitionContext.word.word,
          language: definitionContext.word.language.id,
        },
        wordTarget: {
          word: "null",
          language: translationLanguage?.id,
        },
        provider: translationProvider?.toLowerCase(),
      });

      const definition: DefinitionInterface = await res.data;

      if (definition) {
        if (user) {
          user.credit -= Number(process.env.TRANSLATE_API_CALL_COST) || 1;
          setUser({ ...user });
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
      } else if (e.response?.data?.error) {
        setToastMessage(e.response.data.error);
      } else {
        setToastMessage("An error occured.");
      }

      setShowToast(true);
    }

    setDefinitionAreaIsLoading(false);
  };

  const renderProvider = (provider) => {
    switch (provider) {
      case "yandex":
        return (
          <Link target="blank" href="http://api.yandex.com/dictionary">
            <p className="m-3 text-right text-sm">
              Powered by Yandex.Dictionary
            </p>
          </Link>
        );
      default:
        let providerFormatted;
        switch (provider) {
          case "chatgpt":
            providerFormatted = "ChatGPT";
            break;
          case "microsoft":
            providerFormatted = "Microsoft";
            break;
        }

        return (
          <p className="m-3 text-right text-sm">
            Translation provided by {providerFormatted}
          </p>
        );
    }
  };

  return (
    <div className="mb-20 mr-5">
      <Form.Root
        className="m-4 flex items-center justify-end gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          getTranslation();
        }}
      >
        <Form.Field name="translation_language">
          <div className="flex items-baseline justify-between">
            <Form.Label className="mb-2 text-xs">Language</Form.Label>
            <Form.Message
              className="text-[13px] opacity-[0.8]"
              match="valueMissing"
            >
              Please select a language to translate this word into.
            </Form.Message>
          </div>
          <LanguageSelector
            selectedLanguage={translationLanguage}
            setSelectedLanguage={setTranslationLanguage}
            className="h-[30px]"
          />
          <Form.Control asChild>
            <input
              type="text"
              id="translation_language"
              name="translation_language"
              className="hidden"
              value={textLanguage ? textLanguage.id : ""}
              required
            />
          </Form.Control>
        </Form.Field>

        <Form.Field name="translation_provider">
          <div className="flex items-baseline justify-between">
            <Form.Label className="mb-2 text-xs">Provider</Form.Label>
            <Form.Message
              className="text-[13px] opacity-[0.8]"
              match="valueMissing"
            >
              Please select a provider to translate this word with.
            </Form.Message>
          </div>
          <ProviderSelector
            selectedProvider={translationProvider}
            setSelectedProvider={setTranslationProvider}
            className="h-[30px]"
          />
          <Form.Control asChild>
            <input
              type="text"
              id="translation_provider"
              name="translation_provider"
              className="hidden"
              value={translationProvider?.toString()}
              required
            />
          </Form.Control>
        </Form.Field>

        <button
          type="submit"
          className="mt-6"
          disabled={
            !translationProvider ||
            !translationLanguage ||
            definitionAreaIsLoading
          }
        >
          <PaperPlaneIcon />
        </button>
      </Form.Root>

      <p className="text-2xl">{definitionContext.word.word}</p>

      <Separator.Root className="my-4 bg-amber-100 data-[orientation=horizontal]:h-[2px] data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-[2px]" />

      {definitionAreaIsLoading ? (
        <div className="flex w-full items-center justify-center">
          <LoadingCircle />
        </div>
      ) : (
        <>
          {definitionContext.translations.length > 0 ? (
            <>
              {definitionContext.word.word.split(" ").length > 1 ? (
                <span>
                  {definitionContext.translations[0].wordTarget?.word}
                </span>
              ) : (
                <Accordion.Root
                  className="flex flex-col gap-y-4 rounded-md"
                  type="multiple"
                >
                  {definitionContext.translations.map((translation) => (
                    <TranslationItem
                      key={translation.id}
                      translation={translation}
                    />
                  ))}
                </Accordion.Root>
              )}

              {renderProvider(definitionContext.translations[0].provider)}
            </>
          ) : (
            <p className="text-sm">
              We did not find any translation in your language for this word.
            </p>
          )}
        </>
      )}
    </div>
  );
}
