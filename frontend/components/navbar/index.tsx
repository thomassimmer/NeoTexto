"use client";

import { useUserContext } from "@/app/providers/user-provider";
import MobileMenu from "@/components/navbar/mobile-menu";
import useWindowSize from "@/lib/hooks/use-window-size";
import * as Tooltip from "@radix-ui/react-tooltip";
import Link from "next/link";
import { useState } from "react";
import LeftButton from "./left-button";

export default function Navbar() {
  const { user } = useUserContext();
  const { isMobile, isDesktop } = useWindowSize();
  const [tooltipVisible, setTooltipVisible] = useState(false);

  return (
    <header
      className={
        "fixed top-0 z-[1] w-full border-b-2 border-amber-100 bg-amber-50 px-6"
      }
    >
      <div className="flex h-16 items-center justify-between">
        {user && isMobile && <MobileMenu />}

        <div className="flex justify-self-center sm:justify-self-start">
          <Link href="/" className="flex items-center font-display text-2xl">
            <p className="pl-2">
              <span>Neo</span>
              <span className="text-amber-400">Texto</span>
            </p>
          </Link>
        </div>

        <div className="flex items-center justify-end gap-5">
          {isDesktop && user && (
            <Tooltip.Provider>
              <Tooltip.Root
                open={tooltipVisible}
                onOpenChange={setTooltipVisible}
              >
                <Tooltip.Trigger asChild>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setTooltipVisible(!tooltipVisible);
                    }}
                  >
                    <p className="cursor-pointer text-sm italic text-gray-500">
                      Credit: {user.credit}
                    </p>
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal
                  container={document.getElementsByTagName("header")[0]}
                >
                  <Tooltip.Content
                    className="max-w-[350px] select-none rounded-[4px] border-2 border-amber-200 bg-white px-[15px] py-[10px] text-sm leading-none will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade"
                    sideOffset={5}
                    side="bottom"
                  >
                    <p className="mb-2">
                      Your credit is reduced each time you request a
                      translation, a new generated text or a text from an image.
                    </p>
                    <p>
                      If you no longer have credit but wish to continue using
                      the site, please contact us.
                    </p>
                    <Tooltip.Arrow className="rounded-[4px] bg-amber-200 fill-white" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          )}
          <LeftButton />
        </div>
      </div>
    </header>
  );
}
