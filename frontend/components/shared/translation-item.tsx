"use client";

import { useDefinitionContext } from "@/app/providers/definition-provider";
import { useToastContext } from "@/app/providers/toast-provider";
import { axiosPublic } from "@/lib/axios";
import {
  ExampleInterface,
  TranslationInterface,
  UserTranslationInterface,
} from "@/types/types";
import * as Accordion from "@radix-ui/react-accordion";
import {
  CheckCircledIcon,
  ChevronDownIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useState } from "react";

export default function TranslationItem({
  translation,
}: {
  translation: TranslationInterface;
}) {
  const { userTranslations, setUserTranslations } = useDefinitionContext();
  const {
    setToastCategory,
    setToastMessage,
    setToastTitle,
    setShowToast,
    setToastPosition,
    setToastDuration,
  } = useToastContext();

  const [buttonIsClicked, setButtonIsClicked] = useState(false);
  const [userTranslation, setUserTranslation] = useState<
    UserTranslationInterface[]
  >(userTranslations.filter((ut) => ut.translation.id == translation.id));

  const addToUserTranslations = async (translation: TranslationInterface) => {
    setButtonIsClicked(true);

    try {
      const res = await axiosPublic.post("/back/api/user-translations/", {
        translation: translation.id,
      });

      if (res.data) {
        userTranslations.push(res.data);
        setUserTranslations(userTranslations);
        setUserTranslation([res.data]);

        setToastCategory("success");
        setToastTitle("Success !");
        setToastDuration(3000);
        setToastPosition("bottom-right");
        setToastMessage(
          `The following word was added to your list of vocabulary: ${translation.wordSource.word} (${translation.wordTarget.word})`,
        );
        setShowToast(true);
      }
    } catch (e) {
      // console.log(e);
      setToastCategory("error");
      setToastTitle("Error");
      setToastDuration(3000);
      setToastPosition("bottom-right");
      setToastMessage(
        "An error occured. This word could not be added to your list of vocabulary.",
      );
      setShowToast(true);
    }

    setButtonIsClicked(false);
  };

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
        setUserTranslation([]);

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
      // console.log(e);
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

  return (
    <Accordion.Item
      className="mt-px overflow-hidden rounded-md border-b border-gray-200 shadow-sm first:mt-0 first:rounded-t last:rounded-b hover:shadow-md"
      value={`item-${translation.id}`}
      key={translation.id}
    >
      <Accordion.Header className="flex shadow-[0_1px_0]">
        {userTranslation.length > 0 ? (
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  className="ml-3"
                  disabled={buttonIsClicked}
                  onClick={(e) =>
                    removeFromUserTranslations(userTranslation[0])
                  }
                >
                  <CheckCircledIcon className="text-[16px] text-green-500" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="max-w-[200px] select-none rounded-[4px] border-2 border-amber-200 bg-white px-[15px] py-[10px] text-sm leading-none will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade"
                  sideOffset={5}
                >
                  This word is in your vocabulary list. Click here to remove it.
                  <Tooltip.Arrow className="rounded-[4px] bg-amber-200 fill-white" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        ) : (
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  className="ml-3"
                  disabled={buttonIsClicked}
                  onClick={(e) => addToUserTranslations(translation)}
                >
                  <PlusCircledIcon className="text-[16px] text-orange-500" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="max-w-[200px] select-none rounded-[4px] border-2 border-amber-200 bg-white px-[15px] py-[10px] text-sm leading-none will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade"
                  sideOffset={5}
                >
                  Click to add this word in your vocabulary list.
                  <Tooltip.Arrow className="rounded-[4px] bg-amber-200 fill-white" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        )}

        <Accordion.Trigger className="group flex h-[45px] flex-1 cursor-default items-center justify-between px-5 text-sm leading-none outline-none">
          <span>{translation.wordTarget?.word}</span>
          {translation.examples && translation.examples.length > 0 && (
            <ChevronDownIcon
              className="transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180"
              aria-hidden
            />
          )}
        </Accordion.Trigger>
      </Accordion.Header>

      {translation.examples && translation.examples.length > 0 && (
        <Accordion.Content className="overflow-hidden p-1 text-xs data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
          <ul className="list-disc">
            {translation.examples?.map((example: ExampleInterface, i) => (
              <li key={i} className="my-2 ml-[18px]">
                <p>
                  <span>{example.sourcePrefix}</span>
                  <span className="font-bold">{example.sourceTerm}</span>
                  <span>{example.sourceSuffix}</span>
                </p>
                <p className="italic">
                  <span>{example.targetPrefix}</span>
                  <span className="font-bold">{example.targetTerm}</span>
                  <span>{example.targetSuffix}</span>
                </p>
              </li>
            ))}
          </ul>
        </Accordion.Content>
      )}
    </Accordion.Item>
  );
}
