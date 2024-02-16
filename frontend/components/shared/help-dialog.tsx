"use client";

import { useIntroductionContext } from "@/app/providers/introduction-dialog-provider";
import useWindowSize from "@/lib/hooks/use-window-size";
import * as Dialog from "@radix-ui/react-dialog";
import {
  CheckCircledIcon,
  Cross2Icon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";

export const HelpDialog = () => {
  const { showHelpDialog, setShowHelpDialog } = useIntroductionContext();
  const { isDesktop } = useWindowSize();

  return (
    <Dialog.Root
      open={showHelpDialog}
      onOpenChange={setShowHelpDialog}
      modal={false} // So the scroll of language box works
    >
      <Dialog.Portal>
        {showHelpDialog && (
          <div className="data-[state=open]:animate-overlayShow fixed inset-0 z-[2] bg-black/50" />
        )}
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] z-[3] max-h-[85vh] w-[90vw] max-w-[850px] translate-x-[-50%] translate-y-[-50%] overflow-auto rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-[17px] font-medium">
            How to use NeoTexto ?
          </Dialog.Title>
          <Dialog.Description className="text-mauve11 mb-5 mt-[10px] flex flex-col gap-y-3 text-[15px] leading-normal">
            <p>
              You can use NeoTexto to read texts in many different languages and
              quickly have access to translations.
            </p>
            <p>
              If you do not know <span className="font-bold">a word</span>,
              click on it to get its translations and examples in your mother
              tongue.
            </p>
            <p>
              A list of translations will appear. Click on them to see examples
              of use if any.
            </p>
            <p>
              You can then click on the
              <span className="inline-block px-2 align-middle">
                <PlusCircledIcon className="text-[16px] text-orange-500" />
              </span>
              button to the left of a translation to save it in your vocabulary
              list.
            </p>
            <p>
              If the word is in your list, a
              <span className="inline-block px-2 align-middle">
                <CheckCircledIcon className="text-[16px] text-green-500" />
              </span>
              button will appear to the left of the translation that you can
              click on to remove it from your vocabulary list.
            </p>
            <div
              className={`w-[800px] max-w-full ${
                isDesktop && "rounded-lg border-4 border-amber-300"
              }`}
            >
              <Image
                src={
                  isDesktop ? "/trad_example.webp" : "/trad_example_mobile.webp"
                }
                alt="Presentation of the text generation feature."
                width={800}
                height={800}
                className="rounded-sm"
              ></Image>
            </div>
            <p>
              Select <span className="font-bold">a group of words</span> to get
              its translation.
            </p>
            <div
              className={`w-[800px] max-w-full ${
                isDesktop && "rounded-lg border-4 border-amber-300"
              }`}
            >
              <Image
                src={
                  isDesktop
                    ? "/trad_group_example.webp"
                    : "/trad_group_example_mobile.webp"
                }
                alt="Presentation of the translation feature for groups of words."
                width={800}
                height={800}
                className="rounded-sm"
              ></Image>
            </div>
          </Dialog.Description>

          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
