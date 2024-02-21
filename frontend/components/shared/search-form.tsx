"use client";

import { useGeneratedTexts } from "@/app/providers/generated-texts-provider";
import { useLanguageContext } from "@/app/providers/language-provider";
import { useUserContext } from "@/app/providers/user-provider";
import useAxiosAuth from "@/lib/hooks/use-axios-auth";
import { TextInterface } from "@/types/types";
import * as Accordion from "@radix-ui/react-accordion";
import * as Form from "@radix-ui/react-form";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useState } from "react";
import LanguageSelector from "./language-selector";

export default function SearchForm() {
  const axiosPublic = useAxiosAuth();

  const { user, setUser } = useUserContext();
  const { textLanguage, setTextLanguage } = useLanguageContext();
  const { generatedTexts, setIdxTextFocusedOn, setGeneratedTexts } =
    useGeneratedTexts();

  const [textSubject, setTextSubject] = useState("");
  const [textIsBeingGenerated, setTextIsBeingGenerated] = useState(false);
  const [error, setError] = useState("");
  const [topicShouldBeRandom, setTopicShouldBeRandom] = useState("");
  const [textLevel, setTextLevel] = useState("intermediate");
  const [textLength, setTextLength] = useState("50");

  const generateText = async () => {
    setError("");
    setTextIsBeingGenerated(true);

    try {
      if (textSubject.length == 0 && !topicShouldBeRandom) {
        setError("Please enter a subject.");
        setTextIsBeingGenerated(false);
        return;
      }

      const data = {
        subject: textSubject,
        language: textLanguage?.id,
        topic_should_be_random: topicShouldBeRandom == "random",
        level: textLevel,
        length: textLength,
      };

      const res = await axiosPublic.post(`/back/api/texts/`, data);
      const textObject: TextInterface = res.data;

      if (user) {
        user.credit -= Number(process.env.GPT_API_CALL_COST) || 1;
        setUser({ ...user });
      }

      setGeneratedTexts([textObject].concat(generatedTexts));
      setIdxTextFocusedOn(textObject.id);
      setTextSubject("");
    } catch (err) {
      // TODO: Handle properly.
    }

    setTextIsBeingGenerated(false);
  };

  const toggleGroupItemClasses =
    "py-1 px-3 text-sm hover:bg-amber-200 data-[state=on]:bg-amber-300 flex items-center justify-center bg-amber-100 first:rounded-l last:rounded-r";

  return (
    <Form.Root
      className="m-4 flex flex-col items-center justify-center gap-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        generateText();
      }}
    >
      <label htmlFor="text-subject" className="sr-only">
        Text subject
      </label>
      <input
        id="text-subject"
        name="text-subject"
        type="text"
        className="w-full flex-auto rounded-md border border-gray-200 bg-amber-100 px-3.5 py-2 shadow-sm hover:shadow-md focus:border-green-500 focus:ring-0 sm:text-sm sm:leading-6"
        placeholder="Generate a text about..."
        value={textSubject}
        onChange={(e) => {
          setTextSubject(e.target.value);
          setTopicShouldBeRandom("");
        }}
        disabled={textIsBeingGenerated}
        autoFocus
      />

      <Accordion.Root
        className="flex w-full flex-col gap-8 rounded-md"
        type="single"
        collapsible
      >
        <Accordion.Item
          className="rounded-md border-0 bg-amber-100 shadow-sm hover:shadow-md"
          value="params-ai-generation"
        >
          <Accordion.Header className="flex">
            <Accordion.Trigger className="group flex h-[35px] flex-1 cursor-pointer items-center justify-between px-5 text-[15px] leading-none text-gray-700 outline-none">
              <span>Parameters</span>
              <ChevronDownIcon
                className="transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180"
                aria-hidden
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="flex flex-col items-center justify-center gap-y-3 overflow-auto data-[state=open]:animate-slideDown">
            <ToggleGroup.Root
              className="inline-flex space-x-px rounded shadow-md"
              type="single"
              aria-label="Generate a text using a random topic"
              value={topicShouldBeRandom}
              onValueChange={(value) => {
                setTopicShouldBeRandom(value);
                setTextSubject("");
              }}
            >
              <ToggleGroup.Item
                className={toggleGroupItemClasses}
                value="random"
                aria-label="Generate a text using a random topic"
              >
                Random subject
              </ToggleGroup.Item>
            </ToggleGroup.Root>

            <ToggleGroup.Root
              className="grid space-x-px rounded shadow-md xl:inline-flex"
              style={{ gridTemplate: `"a a" "b b" "b b"` }}
              type="single"
              aria-label="Text level"
              value={textLevel}
              onValueChange={(value) => {
                setTextLevel(value);
              }}
            >
              <p
                className="flex items-center justify-center px-3"
                style={{ gridArea: "a" }}
              >
                Level:
              </p>
              <ToggleGroup.Item
                className={toggleGroupItemClasses}
                value="beginner"
                aria-label="Beginner"
              >
                Beginner
              </ToggleGroup.Item>
              <ToggleGroup.Item
                className={toggleGroupItemClasses}
                value="intermediate"
                aria-label="Intermediate"
              >
                Intermediate
              </ToggleGroup.Item>
              <ToggleGroup.Item
                className={toggleGroupItemClasses}
                value="advanced"
                aria-label="Advanced"
              >
                Advanced
              </ToggleGroup.Item>
              <ToggleGroup.Item
                className={toggleGroupItemClasses}
                value="mastery"
                aria-label="Mastery"
              >
                Mastery
              </ToggleGroup.Item>
            </ToggleGroup.Root>

            <ToggleGroup.Root
              className="mb-5 grid space-x-px rounded shadow-md lg:inline-flex"
              style={{ gridTemplate: `"a a a a" "b c d e"` }}
              type="single"
              aria-label="Text length"
              value={textLength}
              onValueChange={(value) => {
                setTextLength(value);
              }}
            >
              <p
                className="flex items-center justify-center px-3"
                style={{ gridArea: "a" }}
              >
                Length:
              </p>
              <ToggleGroup.Item
                className={toggleGroupItemClasses}
                value="50"
                aria-label="50 words"
              >
                50
              </ToggleGroup.Item>
              <ToggleGroup.Item
                className={toggleGroupItemClasses}
                value="200"
                aria-label="200 words"
              >
                200
              </ToggleGroup.Item>
              <ToggleGroup.Item
                className={toggleGroupItemClasses}
                value="400"
                aria-label="400 words"
              >
                400
              </ToggleGroup.Item>
              <p className="flex items-center justify-center px-3">words.</p>
            </ToggleGroup.Root>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>

      <Form.Field name="mother_tongue">
        <div className="flex items-baseline justify-between">
          <Form.Label className="mb-2 block text-sm font-medium text-gray-900">
            Language
          </Form.Label>
          <Form.Message
            className="text-[13px] opacity-[0.8]"
            match="valueMissing"
          >
            Please select a language to generate a text.
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
            id="mother_tongue"
            name="mother_tongue"
            className="hidden"
            value={textLanguage ? textLanguage.id : ""}
            required
          />
        </Form.Control>
      </Form.Field>

      <button
        type="submit"
        className="flex-none rounded-md bg-green-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
        disabled={textIsBeingGenerated}
      >
        Go
      </button>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </Form.Root>
  );
}
