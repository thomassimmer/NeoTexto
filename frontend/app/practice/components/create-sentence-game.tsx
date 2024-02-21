"use client";

import { useDefinitionContext } from "@/app/providers/definition-provider";
import { useLanguageContext } from "@/app/providers/language-provider";
import { useToastContext } from "@/app/providers/toast-provider";
import { useUserContext } from "@/app/providers/user-provider";
import { LoadingCircle } from "@/components/icons";
import { axiosPublic } from "@/lib/axios";
import { shuffle } from "@/lib/utils";
import { UserTranslationInterface } from "@/types/types";
import * as Accordion from "@radix-ui/react-accordion";
import { CheckCircledIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import * as Separator from "@radix-ui/react-separator";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useEffect, useState } from "react";

export default function CreateSentenceGame({ setShowCreateSentenceGame }) {
  const { userTranslations, setUserTranslations } = useDefinitionContext();
  const { languages } = useLanguageContext();
  const { user, setUser } = useUserContext();
  const {
    setToastCategory,
    setToastMessage,
    setToastTitle,
    setShowToast,
    setToastPosition,
    setToastDuration,
  } = useToastContext();

  const [userSentence, setUserSentence] = useState("");
  const [gptAnswer, setGptAnswer] = useState("");
  const [gptIsLoading, setGptIsLoading] = useState(false);
  const [questionHasBeenAnswered, setQuestionHasBeenAnswered] = useState(false);
  const [listOfUserTranslations, setListOfUserTranslations] = useState<
    UserTranslationInterface[]
  >([]);
  const [instanceIdx, setInstanceIdx] = useState(0);
  const [errorInSentence, setErrorInSentence] = useState("");
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
    const newListOfUserTranslations: UserTranslationInterface[] =
      userTranslations;
    shuffle(newListOfUserTranslations);
    setListOfUserTranslations(newListOfUserTranslations);
  }, [userTranslations]);

  const correctAnswer = async () => {
    setQuestionHasBeenAnswered(true);
    setErrorInSentence("");

    const sentence = userSentence.trim();
    if (sentence && sentence.length < 200) {
      setGptIsLoading(true);
      try {
        if (user) {
          user.credit -= Number(process.env.TRANSLATE_API_CALL_COST) || 1;
          setUser({ ...user });
        }

        const resp = await axiosPublic.post("/back/api/game/create-sentence/", {
          sentence,
          translation: listOfUserTranslations[instanceIdx].translation.id,
          language: user?.motherTongue.id,
        });

        setGptAnswer(resp.data.answer);
      } catch (e) {
        setErrorInSentence("We are sorry, an error occured on our side.");
      }
      setGptIsLoading(false);
    } else {
      setErrorInSentence(
        "Your sentence is empty or too long. The maximum length is 200 characters.",
      );
      setQuestionHasBeenAnswered(false);
    }
  };

  const practiceAgain = () => {
    setInstanceIdx((instanceIdx + 1) % listOfUserTranslations.length);
    setQuestionHasBeenAnswered(false);
    setUserSentence("");
    setGptAnswer("");
    setErrorInSentence("");
  };

  return (
    <section className="mx-2 flex w-full flex-col items-center justify-center">
      {listOfUserTranslations.length > 0 ? (
        <>
          <p className="my-4 font-display text-base">
            Goal: Create a sentence with this word.
          </p>
          <p className="mt-[-8px] text-sm">
            ChatGPT will tell you if your sentence is correct and if it is a
            right use of this word.
          </p>

          <form
            className="mt-10 flex w-full flex-col items-center justify-center gap-y-10"
            onSubmit={(e) => {
              e.preventDefault();
              if (questionHasBeenAnswered) {
                practiceAgain();
              } else {
                correctAnswer();
              }
            }}
          >
            <p className="break-words text-base font-bold leading-7">
              <span className="whitespace-pre-line">
                {
                  listOfUserTranslations[instanceIdx].translation.wordSource
                    .word
                }
              </span>
            </p>

            {questionHasBeenAnswered && (
              <>
                {gptIsLoading && <LoadingCircle />}
                {gptAnswer && (
                  <div className="rounded-md bg-white text-gray-700 shadow-md">
                    <p className="break-words p-4 text-base leading-7">
                      <span>
                        <b>
                          <i>Your sentence</i>:&nbsp;
                        </b>
                      </span>
                      <span className="whitespace-pre-line">
                        {userSentence}
                      </span>
                      <br></br>
                      <br></br>
                      <span>
                        <b>
                          <i>ChatGPT</i>:&nbsp;
                        </b>
                      </span>
                      <span className="whitespace-pre-line">{gptAnswer}</span>
                    </p>
                  </div>
                )}
              </>
            )}

            {!questionHasBeenAnswered && (
              <textarea
                id="user-sentence"
                name="user-sentecence"
                className="w-full flex-auto resize-none overflow-hidden rounded-md border-gray-200 bg-white px-3.5 py-2 shadow-sm hover:shadow-md focus:border-green-500 focus:ring-0 sm:w-1/2 sm:text-sm sm:leading-6"
                placeholder="Tap your sentence here"
                value={userSentence}
                onChange={(e) => {
                  setUserSentence(e.target.value);
                }}
                disabled={questionHasBeenAnswered}
                autoFocus
              />
            )}

            <Accordion.Root
              className="flex flex-col gap-y-4 rounded-md shadow-sm hover:shadow-md"
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
                            listOfUserTranslations[instanceIdx].translation
                              .wordTarget.language.id,
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
                                listOfUserTranslations[instanceIdx],
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
                        listOfUserTranslations[instanceIdx].translation
                          .wordSource?.word
                      }
                    </p>
                    <p className="italic">
                      {
                        listOfUserTranslations[instanceIdx].translation
                          .wordTarget?.word
                      }
                    </p>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>

            {errorInSentence && (
              <p className="text-sm text-red-500">{errorInSentence}</p>
            )}

            <Separator.Root className="bg-amber-100 data-[orientation=horizontal]:h-[2px] data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-[2px]" />

            <div className="flex w-full gap-5">
              <button
                type="reset"
                onClick={(e) => {
                  e.preventDefault();
                  setShowCreateSentenceGame(false);
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
