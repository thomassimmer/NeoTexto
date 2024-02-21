"use client";

import { useIntroductionContext } from "@/app/providers/introduction-dialog-provider";
import { useUserContext } from "@/app/providers/user-provider";
import { axiosPublic } from "@/lib/axios";
import { CustomUser, LanguageInterface } from "@/types/types";
import * as Dialog from "@radix-ui/react-dialog";
import * as Form from "@radix-ui/react-form";
import { useState } from "react";
import { LoadingDots } from "../icons";
import LanguageSelector from "./language-selector";

export const IntroductionDialog = () => {
  const {
    showIntroductionDialog,
    setShowIntroductionDialog,
    setShowHelpDialog,
  } = useIntroductionContext();
  const { user, setUser } = useUserContext();

  const [successMessage, setSuccessMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageInterface | null>(null);

  if (!user) {
    return null;
  }

  return (
    <Dialog.Root
      open={showIntroductionDialog}
      onOpenChange={(open) => {
        if (open) setShowIntroductionDialog(true);
      }}
      modal={false} // So the scroll of language box works
    >
      <Dialog.Portal>
        {showIntroductionDialog && (
          <div className="data-[state=open]:animate-overlayShow fixed inset-0 z-[2] bg-black/50" />
        )}
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] z-[3] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-[17px] font-medium">
            Welcome on NeoTexto !
          </Dialog.Title>
          <Dialog.Description className="text-mauve11 mb-5 mt-[10px] flex flex-col gap-y-3 text-[15px] leading-normal">
            <p>
              We are still in a <i>beta</i> mode and for now, users receive 100
              credits to play with. Every time you request a translation, you
              generate a text with chatGPT or you detect text in a picture, it
              costs you 1 credit.
            </p>
            <p>
              If you do not have credit anymore but wish to continue using
              NeoTexto, just send us a message via the contact form and we will
              give you.
            </p>
            <p>Before you can start, please select your mother tongue :</p>
          </Dialog.Description>
          <Form.Root
            onSubmit={async (e) => {
              e.preventDefault();
              const data = Object.fromEntries(new FormData(e.currentTarget));

              const response = await axiosPublic.put(
                `/back/api/users/${user && user.userId}/`,
                {
                  email: user?.email,
                  hasFinishedIntro: true,
                  ...data,
                },
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                },
              );

              if (response.status == 200) {
                const newUserInfo: CustomUser = response.data;
                setUser(newUserInfo);
                setSuccessMessage("Perfect, let's begin");

                setTimeout(() => {
                  setShowIntroductionDialog(false);
                  setSuccessMessage("");
                  setShowHelpDialog(true);
                }, 2000);
              }
            }}
            className="m-4 flex flex-col items-center justify-center gap-y-4"
          >
            <Form.Field name="mother_tongue">
              <div className="flex items-baseline justify-between">
                <Form.Label className="mb-2 block text-sm font-medium text-gray-900">
                  Language
                </Form.Label>
                <Form.Message
                  className="text-[13px] opacity-[0.8]"
                  match="valueMissing"
                >
                  Please enter your mother tongue
                </Form.Message>
              </div>
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                className="h-[40px] w-[200px]"
              />
              <Form.Control asChild>
                <input
                  type="text"
                  id="mother_tongue"
                  name="mother_tongue"
                  className="hidden"
                  value={selectedLanguage ? selectedLanguage.id : ""}
                  required
                />
              </Form.Control>
            </Form.Field>

            <div className="mt-[25px] flex justify-end">
              <button
                type="submit"
                className="flex justify-between rounded-md border-0 bg-amber-100 px-3.5 py-2 shadow-sm hover:bg-amber-200 hover:shadow-md focus:border-green-500 focus:ring-0 sm:text-sm sm:leading-6"
              >
                Save changes
              </button>
            </div>
          </Form.Root>

          {successMessage && (
            <div className="flex items-center justify-center gap-x-2">
              <p className="text-center text-sm text-green-500">
                {successMessage}
              </p>
              <LoadingDots />
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
