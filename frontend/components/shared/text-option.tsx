"use client";

import { useDefinitionContext } from "@/app/providers/definition-provider";
import { useGeneratedTexts } from "@/app/providers/generated-texts-provider";
import useAxiosAuth from "@/lib/hooks/use-axios-auth";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

export default function TextOption({ text, isMobile, setMobileMenuIsOpen }) {
  const axiosPublic = useAxiosAuth();

  const {
    idxTextFocusedOn,
    generatedTexts,
    setIdxTextFocusedOn,
    setGeneratedTexts,
  } = useGeneratedTexts();
  const { setDefinitionAreaIsVisible, setIndexesWordFocused } =
    useDefinitionContext();

  const deleteText = async () => {
    await axiosPublic.delete(`/back/api/texts/${text.id}/`);

    const newGeneratedTexts = generatedTexts.filter((t) => t.id != text.id);
    setGeneratedTexts(newGeneratedTexts);

    if (idxTextFocusedOn == text.id) {
      setIdxTextFocusedOn("-1");
      setDefinitionAreaIsVisible(false);
      setIndexesWordFocused([]);
    }

    if (newGeneratedTexts.length == 0) setIdxTextFocusedOn("-1");
  };

  return (
    <div className="absolute right-0 top-0 p-2">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className="inline-flex w-[30px] items-center justify-center rounded-full border-0 hover:shadow-[0_1px_5px] focus:border-green-500 focus:ring-0"
            aria-label="Customise options"
            type="button"
          >
            <DotsHorizontalIcon />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal container={document.getElementById("list-texts")}>
          <DropdownMenu.Content
            className="min-w-[220px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
            side={isMobile ? "left" : "right"}
            sideOffset={5}
          >
            <DropdownMenu.Item
              className="data-[highlighted]:bg-green data-[highlighted]:text-green group relative flex h-[25px] cursor-pointer items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none outline-none hover:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:text-black"
              onClick={() => deleteText()}
            >
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
