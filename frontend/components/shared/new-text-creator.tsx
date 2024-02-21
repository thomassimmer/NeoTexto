"use client";

import { useGeneratedTexts } from "@/app/providers/generated-texts-provider";
import { useLanguageContext } from "@/app/providers/language-provider";
import { useToastContext } from "@/app/providers/toast-provider";
import useAxiosAuth from "@/lib/hooks/use-axios-auth";
import { TextInterface } from "@/types/types";
import * as Accordion from "@radix-ui/react-accordion";
import * as Form from "@radix-ui/react-form";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { LoadingDots } from "../icons";
import ImageToText from "./image-to-text";
import LanguageSelector from "./language-selector";
import SearchForm from "./search-form";

export default function NewTextCreator() {
  const axiosPublic = useAxiosAuth();

  const { generatedTexts, setIdxTextFocusedOn, setGeneratedTexts } =
    useGeneratedTexts();
  const {
    setToastCategory,
    setToastMessage,
    setToastPosition,
    setToastTitle,
    setShowToast,
    setToastDuration,
  } = useToastContext();
  const { textLanguage, setTextLanguage } = useLanguageContext();

  const [error, setError] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [textIsBeingImported, setTextIsBeingImported] = useState(false);

  const importPastedText = async (data) => {
    setError("");

    if (!data.language) {
      setError("Please select a language.");
      return;
    }

    if (pastedText.length == 0) {
      setError("Please enter a text.");
      return;
    }

    if (pastedText.length > 10000) {
      setError("Your text is too long. The limit is 10 000 characters.");
      return;
    }

    setTextIsBeingImported(true);

    try {
      const res = await axiosPublic.post(`/back/api/texts/`, {
        text: pastedText,
        language: data.language,
      });

      const textObject: TextInterface = res.data;

      setGeneratedTexts([textObject].concat(generatedTexts));
      setTextIsBeingImported(false);
      setIdxTextFocusedOn(textObject.id);
    } catch (e) {
      setToastCategory("error");
      setToastTitle("Error");
      setToastPosition("top-middle");
      setToastDuration(5000);
      setToastMessage("An error occured.");
      setShowToast(true);
    }
  };

  return (
    <>
      <Accordion.Root
        className="flex w-full flex-col gap-8 rounded-md"
        type="single"
        collapsible
      >
        <Accordion.Item
          className="mt-px overflow-hidden rounded-md border-0 bg-amber-100 shadow-md first:mt-0 first:rounded-t last:rounded-b hover:bg-amber-200 hover:shadow-lg data-[state=open]:bg-amber-200"
          value="ai-generation"
        >
          <Accordion.Header className="flex">
            <Accordion.Trigger className="group flex h-[45px] flex-1 cursor-pointer items-center justify-between px-5 text-[15px] leading-none outline-none">
              <span>Generate a text</span>
              <ChevronDownIcon
                className="transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180"
                aria-hidden
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden p-1 text-[15px] data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
            <SearchForm />
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item
          className="mt-px overflow-hidden rounded-md border-0 bg-amber-100 shadow-md first:mt-0 first:rounded-t last:rounded-b hover:bg-amber-200 hover:shadow-lg data-[state=open]:bg-amber-200"
          value="paste-a-text"
        >
          <Accordion.Header className="flex">
            <Accordion.Trigger className="group flex h-[45px] flex-1 cursor-pointer items-center justify-between px-5 text-[15px] leading-none outline-none">
              <span>Paste your text</span>
              <ChevronDownIcon
                className="transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180"
                aria-hidden
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden p-1 text-[15px] data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
            <Form.Root
              onSubmit={(e) => {
                e.preventDefault();
                const data = Object.fromEntries(new FormData(e.currentTarget));
                importPastedText(data);
              }}
              className="m-4 flex flex-col items-center justify-center gap-y-4"
            >
              <textarea
                id="pasted-text"
                name="pasted-text"
                className="w-full min-w-0 flex-auto resize-none overflow-hidden rounded-md border-gray-200 bg-amber-100 px-3.5 py-2 shadow-sm hover:shadow-md focus:border-green-500 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="Paste your text here..."
                onChange={(e) => {
                  setPastedText(e.target.value);
                  e.target.style.height = "1.5rem";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                disabled={textIsBeingImported}
                autoFocus
              />

              <Form.Field name="language">
                <div className="flex items-baseline justify-between">
                  <Form.Label className="mb-2 block text-sm font-medium text-gray-900">
                    Language
                  </Form.Label>
                  <Form.Message
                    className="text-[13px] opacity-[0.8]"
                    match="valueMissing"
                  >
                    Please provide the language used in this text.
                  </Form.Message>
                </div>
                <LanguageSelector
                  selectedLanguage={textLanguage}
                  setSelectedLanguage={setTextLanguage}
                  className="h-[40px] w-[200px]"
                />
                <Form.Control asChild>
                  <input
                    type="text"
                    id="language"
                    name="language"
                    className="hidden"
                    value={textLanguage ? textLanguage.id : ""}
                    required
                  />
                </Form.Control>
              </Form.Field>

              <button
                type="submit"
                className="w-fit rounded-md bg-green-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
                disabled={textIsBeingImported}
              >
                {textIsBeingImported ? (
                  <LoadingDots color="#808080" />
                ) : (
                  "Import"
                )}
              </button>
              {error && <p className="text-xs text-red-500">{error}</p>}
            </Form.Root>
          </Accordion.Content>
        </Accordion.Item>

        <Accordion.Item
          className="mt-px overflow-hidden rounded-md border-0 bg-amber-100 shadow-md first:mt-0 first:rounded-t last:rounded-b hover:bg-amber-200 hover:shadow-lg data-[state=open]:bg-amber-200"
          value="take-a-picture"
        >
          <Accordion.Header className="flex">
            <Accordion.Trigger className="group flex h-[45px] flex-1 cursor-pointer items-center justify-between px-5 text-[15px] leading-none outline-none">
              <span>Import text from an image</span>
              <ChevronDownIcon
                className="transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180"
                aria-hidden
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden p-1 text-[15px] data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
            <ImageToText />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </>
  );
}
