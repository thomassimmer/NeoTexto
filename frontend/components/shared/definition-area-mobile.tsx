"use client";

import { useDefinitionContext } from "@/app/providers/definition-provider";
import Sheet from "react-modal-sheet";
import DefinitionArea from "./definition-area";

export default function DefinitionAreaMobile() {
  const {
    definitionAreaIsVisible,
    setDefinitionAreaIsVisible,
    setIndexesWordFocused,
  } = useDefinitionContext();

  return (
    <>
      <Sheet
        className="z-[49!important]"
        isOpen={definitionAreaIsVisible}
        onClose={() => {
          setDefinitionAreaIsVisible(false);
          setIndexesWordFocused([]);
        }}
      >
        <Sheet.Container className="bg-gradient-to-b from-amber-50 to-amber-100">
          <Sheet.Header />
          <Sheet.Content className="p-5">
            <DefinitionArea />
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </>
  );
}
