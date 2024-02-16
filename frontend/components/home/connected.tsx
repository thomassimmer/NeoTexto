"use client";

import { useGeneratedTexts } from "@/app/providers/generated-texts-provider";
import Text from "@/components/shared/text";
import TextList from "@/components/shared/text-list";
import useWindowSize from "@/lib/hooks/use-window-size";
import DefinitionAreaMobile from "../shared/definition-area-mobile";
import DefinitionAreaWeb from "../shared/definition-area-web";
import NewTextCreator from "../shared/new-text-creator";

export default function HomeConnected() {
  const { isDesktop } = useWindowSize();
  const { idxTextFocusedOn } = useGeneratedTexts();

  return (
    <>
      {isDesktop && <TextList setMobileMenuIsOpen={() => {}} />}

      <div
        className={`flex min-h-[calc(100vh-4rem)] items-center justify-center py-10 ${
          isDesktop && "mx-[25%]"
        }`}
      >
        <div className="flex min-h-full w-4/5 flex-col items-center justify-center">
          {idxTextFocusedOn == "-1" ? <NewTextCreator /> : <Text />}
        </div>
      </div>

      {isDesktop ? <DefinitionAreaWeb /> : <DefinitionAreaMobile />}
    </>
  );
}
