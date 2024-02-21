"use client";

import { useDefinitionContext } from "@/app/providers/definition-provider";
import { useGeneratedTexts } from "@/app/providers/generated-texts-provider";
import { useLanguageContext } from "@/app/providers/language-provider";
import { useToastContext } from "@/app/providers/toast-provider";
import { axiosPublic } from "@/lib/axios";
import { shuffle } from "@/lib/utils";
import { UserTranslationInterface } from "@/types/types";
import * as Accordion from "@radix-ui/react-accordion";
import { CheckCircledIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import * as Separator from "@radix-ui/react-separator";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useEffect, useState } from "react";

interface MissingWordGameInstance {
  sentenceComplete: string;
  sentenceIncomplete: string;
  userTranslation: UserTranslationInterface;
  goodAnswer: string;
}

export default function MissingWordGame({ setShowMissingWordGame }) {
  const { generatedTexts } = useGeneratedTexts();
  const { userTranslations, setUserTranslations } = useDefinitionContext();
  const { languages } = useLanguageContext();
  const {
    setToastCategory,
    setToastMessage,
    setToastTitle,
    setShowToast,
    setToastPosition,
    setToastDuration,
  } = useToastContext();

  const [userAnswer, setUserAnswer] = useState("");
  const [questionHasBeenAnswered, setQuestionHasBeenAnswered] = useState(false);
  const [userIsRight, setUserRight] = useState(false);
  const [instanceIdx, setInstanceIdx] = useState(0);
  const [listOfInstances, setListOfInstances] = useState<
    MissingWordGameInstance[]
  >([]);
  const [listOfAnswers, setListOfAnswers] = useState<string[]>([]);
  const [buttonIsClicked, setButtonIsClicked] = useState(false);

  const removeFromUserTranslations = async (
    userTranslation: UserTranslationInterface,
  ) => {
    setButtonIsClicked(true);

    try {
      const res = await axiosPublic.delete(
        `/back/api/user-translations/${userTranslation.id}/`,
      );

      if (res.status == 204) {
        setUserTranslations(
          userTranslations.filter((ut) => ut.id != userTranslation.id),
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
    setButtonIsClicked(false);
  };

  useEffect(() => {
    const newListOfInstances: MissingWordGameInstance[] = [];

    for (let text of generatedTexts) {
      const sentence_text = text.text.split(/[\.\n]+/g);
      const sentence_lemmas = text.lemmas.split(/[\.\n]+/g);

      for (let sentence_idx in sentence_text) {
        const sentence = sentence_text[sentence_idx].split(/_\$_/);
        const lemmas = sentence_lemmas[sentence_idx].split(/_\$_/);

        for (let userTranslation of userTranslations) {
          const wordSource = userTranslation.translation.wordSource.word;
          const wordIdx = lemmas.findIndex((l) => l == wordSource);

          if (wordIdx > -1) {
            const sentenceComplete = sentence.join(" ").trim() + ".";
            const goodAnswer = sentence[wordIdx];

            let sentenceIncompleteArray = sentence.slice();
            sentenceIncompleteArray[wordIdx] = "......";
            const sentenceIncomplete =
              sentenceIncompleteArray.join(" ").trim() + ".";

            const instance: MissingWordGameInstance = {
              sentenceComplete,
              sentenceIncomplete,
              userTranslation,
              goodAnswer,
            };
            newListOfInstances.push(instance);
          }
        }
      }
    }

    shuffle(newListOfInstances);
    setListOfInstances(newListOfInstances);
  }, [generatedTexts, userTranslations]);

  const createAnswers = () => {
    const newListOfAnswers: string[] = [];
    if (listOfInstances.length > 0) {
      newListOfAnswers.push(listOfInstances[instanceIdx].goodAnswer.trim());

      for (let sentence of listOfInstances) {
        let answer = sentence.goodAnswer.trim();

        if (!newListOfAnswers.includes(answer)) {
          newListOfAnswers.push(answer);
          if (newListOfAnswers.length > 3) {
            break;
          }
        }
      }
    }

    shuffle(newListOfAnswers);
    setListOfAnswers(newListOfAnswers);
  };

  if (listOfAnswers.length == 0 && listOfInstances.length > 0) {
    createAnswers();
  }

  const correctAnswer = () => {
    if (
      userAnswer &&
      userAnswer.trim().toLowerCase() ==
        listOfInstances[instanceIdx].goodAnswer.trim().toLowerCase()
    ) {
      setUserRight(true);
    } else {
      setUserRight(false);
    }

    setQuestionHasBeenAnswered(true);
  };

  const practiceAgain = () => {
    setInstanceIdx((instanceIdx + 1) % listOfInstances.length);
    setQuestionHasBeenAnswered(false);
    setUserAnswer("");
    createAnswers();
  };

  const toggleGroupItemClasses =
    "py-1 px-3 text-sm hover:bg-amber-200 data-[state=on]:bg-amber-300 flex items-center justify-center bg-amber-100 first:rounded-l last:rounded-r";

  return (
    <section className="mx-2 flex w-full flex-col items-center justify-center">
      {listOfInstances.length > 0 ? (
        <>
          <p className="my-4 font-display text-base">
            Goal: Find the missing word in this sentence.
          </p>

          <div className="my-10 rounded-md bg-white text-gray-700 shadow-md">
            <p className="break-words p-4 text-base leading-7">
              <span className="whitespace-pre-line">
                {questionHasBeenAnswered
                  ? listOfInstances[instanceIdx].sentenceComplete
                  : listOfInstances[instanceIdx].sentenceIncomplete}
              </span>
            </p>
          </div>

          <form
            className="flex w-full flex-col items-center justify-center"
            onSubmit={(e) => {
              e.preventDefault();
              if (questionHasBeenAnswered) {
                practiceAgain();
              } else {
                correctAnswer();
              }
            }}
          >
            <input
              className="min-w-[200px] flex-auto resize-none overflow-hidden rounded-md border-gray-200 bg-white px-3.5 py-2 shadow-sm hover:shadow-md focus:border-green-500 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Tap the missing word here"
              type="text"
              value={userAnswer}
              onChange={(e) => {
                setUserAnswer(e.target.value);
              }}
              disabled={questionHasBeenAnswered}
              autoFocus
            />

            <Accordion.Root
              className="my-10 flex flex-col gap-y-4 rounded-md shadow-sm hover:shadow-md"
              type="single"
              collapsible
            >
              <Accordion.Item
                className="mt-px overflow-hidden rounded-md border-b border-gray-200 first:mt-0 first:rounded-t last:rounded-b"
                value="x"
              >
                <Accordion.Header className="flex shadow-[0_1px_0]">
                  <Accordion.Trigger className="group flex h-[45px] flex-1 cursor-default items-center justify-between px-5 text-[15px] leading-none outline-none">
                    <p className="px-3">
                      Hint 1: See the word in&nbsp;
                      {
                        languages.filter(
                          (l) =>
                            l.id ==
                            listOfInstances[instanceIdx].userTranslation
                              .translation.wordTarget.language.id,
                        )[0].name
                      }
                    </p>
                    <ChevronDownIcon
                      className="transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180"
                      aria-hidden
                    />
                  </Accordion.Trigger>
                </Accordion.Header>

                <Accordion.Content className="overflow-hidden text-center text-[15px] data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
                  <div className="my-5 flex items-center justify-center gap-5">
                    <Tooltip.Provider>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <button
                            disabled={buttonIsClicked}
                            onClick={async (e) => {
                              await removeFromUserTranslations(
                                listOfInstances[instanceIdx].userTranslation,
                              );
                              practiceAgain();
                            }}
                          >
                            <CheckCircledIcon className="text-[16px] text-green-500" />
                          </button>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            className="max-w-[200px] select-none rounded-[4px] border-2 border-amber-200 bg-white px-[15px] py-[10px] text-sm leading-none will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade"
                            sideOffset={5}
                          >
                            This word is in your vocabulary list. Click here to
                            remove it.
                            <Tooltip.Arrow className="rounded-[4px] bg-amber-200 fill-white" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                    <p>
                      {
                        listOfInstances[instanceIdx].userTranslation.translation
                          .wordSource?.word
                      }
                    </p>
                    <p className="italic">
                      {
                        listOfInstances[instanceIdx].userTranslation.translation
                          .wordTarget?.word
                      }
                    </p>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>

            {listOfAnswers.length > 1 && (
              <Accordion.Root
                className="mb-10 flex flex-col gap-y-4 rounded-md shadow-sm hover:shadow-md"
                type="single"
                collapsible
              >
                <Accordion.Item
                  className="mt-px flex flex-col items-center justify-center overflow-hidden rounded-md border-b border-gray-200 first:mt-0 first:rounded-t last:rounded-b"
                  value="x"
                >
                  <Accordion.Header className="flex shadow-[0_1px_0]">
                    <Accordion.Trigger className="group flex h-[45px] flex-1 cursor-default items-center justify-between px-5 text-[15px] leading-none outline-none">
                      <p className="px-3">
                        Hint 2: Choose among different answers
                      </p>
                      <ChevronDownIcon
                        className="transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180"
                        aria-hidden
                      />
                    </Accordion.Trigger>
                  </Accordion.Header>

                  <Accordion.Content className="overflow-hidden p-3 text-[15px] data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
                    <ToggleGroup.Root
                      className="grid space-x-px rounded shadow-md xl:inline-flex"
                      style={{ gridTemplate: `"a a" "b b" "b b"` }}
                      type="single"
                      aria-label="User answer"
                      value={userAnswer}
                      onValueChange={(value) => {
                        setUserAnswer(value);
                      }}
                    >
                      {listOfAnswers.map((answer, i) => (
                        <ToggleGroup.Item
                          className={toggleGroupItemClasses}
                          value={answer}
                          aria-label={answer}
                          key={i}
                        >
                          {answer}
                        </ToggleGroup.Item>
                      ))}
                    </ToggleGroup.Root>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
            )}

            {questionHasBeenAnswered && (
              <>
                {userIsRight ? (
                  <p className="text-sm text-green-500">You are right.</p>
                ) : (
                  <p className="text-sm text-orange-500">Try again.</p>
                )}
              </>
            )}

            <Separator.Root className="my-4 bg-amber-100 data-[orientation=horizontal]:h-[2px] data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-[2px]" />
            <div className="flex w-full gap-5">
              <button
                type="reset"
                onClick={(e) => {
                  e.preventDefault();
                  setShowMissingWordGame(false);
                }}
                className="w-full rounded-md border-0 bg-amber-200 px-3.5 py-2 shadow-sm hover:bg-amber-300 hover:shadow-md focus:border-green-500 focus:ring-0 sm:text-sm sm:leading-6"
              >
                Come back
              </button>

              {questionHasBeenAnswered ? (
                <button
                  type="submit"
                  className="w-full rounded-md border-0 bg-amber-200 px-3.5 py-2 shadow-sm hover:bg-amber-300 hover:shadow-md focus:border-green-500 focus:ring-0 sm:text-sm sm:leading-6"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full rounded-md border-0 bg-amber-200 px-3.5 py-2 shadow-sm hover:bg-amber-300 hover:shadow-md focus:border-green-500 focus:ring-0 sm:text-sm sm:leading-6"
                >
                  Check
                </button>
              )}
            </div>
          </form>
        </>
      ) : (
        <p>Your vocabulary list is empty.</p>
      )}
    </section>
  );
}
