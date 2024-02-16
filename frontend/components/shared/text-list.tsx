"use client";

import { useDefinitionContext } from "@/app/providers/definition-provider";
import { useGeneratedTexts } from "@/app/providers/generated-texts-provider";
import useWindowSize from "@/lib/hooks/use-window-size";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import * as Separator from "@radix-ui/react-separator";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { LoadingSpinner } from "../icons";
import NewTextButton from "./new-text-button";
import TextOption from "./text-option";

export default function TextList({ setMobileMenuIsOpen }) {
  const {
    idxTextFocusedOn,
    generatedTexts,
    textPanelIsVisible,
    setIdxTextFocusedOn,
    setTextPanelIsVisible,
  } = useGeneratedTexts();
  const { setDefinitionAreaIsVisible, setIndexesWordFocused } =
    useDefinitionContext();
  const { isDesktop } = useWindowSize();

  useEffect(() => {
    setTimeout(() => {
      setTextPanelIsVisible(true);
    }, 500);
  }, [setTextPanelIsVisible]);

  return (
    <>
      {isDesktop && (
        <motion.aside
          animate={textPanelIsVisible ? "closed" : "open"}
          variants={{
            open: { translateX: 0 },
            closed: { translateX: "-100%" },
          }}
          className={
            "z-1 fixed left-0 h-[calc(100vh-4rem)] border-gray-200 bg-gradient-to-b from-amber-50 to-amber-100 md:z-0 md:block md:bg-transparent"
          }
        >
          <div className="h-full overflow-y-auto px-5 shadow-md">
            <button
              className="pt-5"
              onClick={() => {
                setTextPanelIsVisible(true);
              }}
            >
              <DoubleArrowRightIcon className="h-6" />
            </button>
          </div>
        </motion.aside>
      )}

      <motion.aside
        animate={textPanelIsVisible ? "open" : "closed"}
        variants={{
          open: { translateX: 0 },
          closed: { translateX: "-100%" },
        }}
        id="logo-sidebar"
        className={`z-1 left-0 h-[calc(100vh-4rem)] border-gray-200 bg-gradient-to-b from-amber-50 to-amber-100 md:z-0 md:block md:bg-transparent ${
          isDesktop ? "fixed w-1/4 min-w-[250px] shadow-md" : "w-full"
        }`}
        aria-label="Sidebar"
      >
        <div className="flex h-full flex-col">
          {isDesktop && (
            <div className="flex justify-around px-5 pt-5">
              <>
                <button
                  className="opacity-0"
                  onClick={() => {
                    setTextPanelIsVisible(false);
                  }}
                >
                  <DoubleArrowLeftIcon className="h-6" />
                </button>

                <NewTextButton setMobileMenuIsOpen={setMobileMenuIsOpen} />

                <button
                  className="opacity-100"
                  onClick={() => {
                    setTextPanelIsVisible(false);
                  }}
                >
                  <DoubleArrowLeftIcon className="h-6" />
                </button>
              </>
            </div>
          )}

          <Separator.Root className="my-5 bg-amber-100 data-[orientation=horizontal]:h-[2px] data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-[2px]" />

          {generatedTexts.length > 0 ? (
            <div className="mb-5 overflow-y-auto">
              <ul className="mb-20 font-medium" id="list-texts">
                {generatedTexts
                  .sort((a, b) => (a.id < b.id ? 1 : -1))
                  .map((text, i) => (
                    <li
                      key={i}
                      className="relative mx-5 mb-2 rounded-md shadow-sm hover:shadow-md"
                    >
                      <Link
                        href="/"
                        onClick={(e) => {
                          setIndexesWordFocused([]);
                          setDefinitionAreaIsVisible(false);
                          setIdxTextFocusedOn(text.id);
                          setMobileMenuIsOpen(false);
                        }}
                        className={`flex w-full items-center rounded-md border-b border-amber-200 px-4 py-6 text-gray-900 hover:bg-amber-200 ${
                          idxTextFocusedOn === text.id
                            ? "bg-amber-200"
                            : "bg-amber-100"
                        }`}
                      >
                        <p
                          className="ml-3 max-h-[7em] overflow-hidden text-ellipsis whitespace-pre-line text-sm"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {text.text.replace(/_\$_/g, "")}
                        </p>
                      </Link>
                      <TextOption
                        text={text}
                        isMobile={!isDesktop}
                        setMobileMenuIsOpen={setMobileMenuIsOpen}
                      />
                      {!text.hasFinishedGeneration && (
                        <div className="absolute bottom-0 right-0 h-[40px] w-[40px] p-2">
                          <LoadingSpinner />
                        </div>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <div id="list-texts">
              <p className="text-center text-sm text-gray-700">
                Your texts will appear here...
              </p>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}
