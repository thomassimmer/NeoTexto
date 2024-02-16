"use client";

import { useDefinitionContext } from "@/app/providers/definition-provider";
import { useToastContext } from "@/app/providers/toast-provider";
import useAxiosAuth from "@/lib/hooks/use-axios-auth";
import { UserTranslationInterface } from "@/types/types";
import CloseIcon from "../../../components/icons/close";

export default function VocabularyList() {
  const { userTranslations, setUserTranslations } = useDefinitionContext();
  const axiosPublic = useAxiosAuth();
  const {
    setToastCategory,
    setToastMessage,
    setToastPosition,
    setToastTitle,
    setShowToast,
    setToastDuration,
  } = useToastContext();

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
  };

  return (
    <>
      {userTranslations.length > 0 ? (
        <ul className="w-full list-disc">
          {userTranslations.map((userTranslation, i) => (
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
                <CloseIcon className="h-6" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-4">You do not have words in your list yet.</div>
      )}
    </>
  );
}
