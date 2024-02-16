"use client";

import { useDefinitionContext } from "@/app/providers/definition-provider";
import { motion } from "framer-motion";
import CloseIcon from "../icons/close";
import DefinitionArea from "./definition-area";

export default function DefinitionAreaWeb() {
  const {
    definitionAreaIsVisible,
    setDefinitionAreaIsVisible,
    setIndexesWordFocused,
  } = useDefinitionContext();

  return (
    <motion.aside
      animate={definitionAreaIsVisible ? "open" : "closed"}
      variants={{
        open: { translateX: 0 },
        closed: { translateX: "calc(100% + 12px)" },
      }}
      className={
        "fixed right-3 top-16 z-40 hidden h-[calc(100vh-4rem)] w-1/4 border-gray-200 bg-transparent md:z-0 md:block"
      }
    >
      <div className="flex h-full flex-col shadow-md">
        <button
          className="p-5"
          onClick={() => {
            setDefinitionAreaIsVisible(false);
            setIndexesWordFocused([]);
          }}
          aria-label="Close mobile menu"
          data-testid="close-mobile-menu"
        >
          <CloseIcon className="h-6" />
        </button>

        <div className="mb-5 overflow-auto pl-5">
          <DefinitionArea />
        </div>
      </div>
    </motion.aside>
  );
}
