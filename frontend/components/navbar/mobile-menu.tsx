"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import TextList from "@/components/shared/text-list";
import CloseIcon from "components/icons/close";
import MenuIcon from "components/icons/menu";
import NewTextButton from "../shared/new-text-button";

export default function MobileMenu() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuIsOpen]);

  useEffect(() => {
    setMobileMenuIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <>
      <button
        onClick={() => {
          setMobileMenuIsOpen(!mobileMenuIsOpen);
        }}
        aria-label="Open mobile menu"
        data-testid="open-mobile-menu"
      >
        <MenuIcon className="h-8" />
      </button>
      {mobileMenuIsOpen ? (
        <div className="absolute left-0 top-0 z-[2] flex min-h-screen w-full flex-col bg-gradient-to-b from-amber-50 to-amber-100 p-4 pb-6">
          <div className="flex justify-between">
            <button
              onClick={() => {
                setMobileMenuIsOpen(false);
              }}
              aria-label="Close mobile menu"
              data-testid="close-mobile-menu"
            >
              <CloseIcon className="h-6" />
            </button>
            <NewTextButton setMobileMenuIsOpen={setMobileMenuIsOpen} />
            <button
              className="opacity-0"
              onClick={() => {
                setMobileMenuIsOpen(false);
              }}
            >
              <CloseIcon className="h-6" />
            </button>
          </div>

          <TextList setMobileMenuIsOpen={setMobileMenuIsOpen} />
        </div>
      ) : (
        <div id="list-texts" className="hidden"></div>
      )}
    </>
  );
}
