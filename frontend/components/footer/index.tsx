"use client";

import { useIntroductionContext } from "@/app/providers/introduction-dialog-provider";
import { useModalContext } from "@/app/providers/modal-provider";
import useScroll from "@/lib/hooks/use-scroll";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const scrolled = useScroll(25);
  const { setShowContactModal } = useModalContext();
  const { setShowHelpDialog } = useIntroductionContext();

  return (
    <footer
      className={`relative top-16 flex w-full flex-col items-center justify-center gap-y-5 border-t py-5 text-gray-800 ${
        scrolled
          ? "border-b border-amber-200 bg-amber-50 backdrop-blur-xl"
          : "bg-amber-50"
      }`}
    >
      <p>
        <Link
          className="mx-1 font-medium transition-colors hover:underline"
          href="/"
        >
          NeoTexto
        </Link>
        &nbsp;|&nbsp;
        <Link
          className="mx-1 font-medium transition-colors hover:underline"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setShowHelpDialog(true);
          }}
        >
          Help
        </Link>
        &nbsp;|&nbsp;
        <Link
          className="mx-1 font-medium transition-colors hover:underline"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setShowContactModal(true);
          }}
          rel="noopener noreferrer"
        >
          Contact
        </Link>
        &nbsp;|&nbsp;
        <Link
          className="mx-1 font-medium transition-colors hover:underline"
          href="/privacy-policy"
        >
          Privacy
        </Link>
      </p>
      <Link target="blank" href="http://api.yandex.com/dictionary">
        <p>Powered by Yandex.Dictionary</p>
      </Link>
      <Link href="/">
        <Image
          src="/logo.webp"
          alt="NeoTexto logo"
          width={60}
          height={60}
          className="mr-2 rounded-sm"
        ></Image>
      </Link>
    </footer>
  );
}
