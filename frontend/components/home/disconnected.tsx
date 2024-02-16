"use client";

import { useModalContext } from "@/app/providers/modal-provider";
import useWindowSize from "@/lib/hooks/use-window-size";
import Image from "next/image";
import Balancer from "react-wrap-balancer";

export default function HomeDisconnected() {
  const { setShowSignInModal, showSignUpEmailForm } = useModalContext();
  const { isDesktop } = useWindowSize();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex min-h-screen w-full grow flex-col justify-center px-5 xl:px-0">
        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm md:text-7xl"
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          <Balancer>
            <span>Neo</span>
            <span className="text-amber-400">Texto</span>
          </Balancer>
        </h1>

        <h2
          className="mt-3 animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-2xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm md:text-5xl"
          style={{
            lineHeight: "1.1",
            animationDelay: "0.15s",
            animationFillMode: "forwards",
          }}
        >
          <Balancer>
            A new way to improve your foreign language skills.
          </Balancer>
        </h2>

        <p
          className="mt-6 animate-fade-up text-center text-gray-500 opacity-0 md:text-xl"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          <Balancer>
            If you already have an account, you can&nbsp;
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                showSignUpEmailForm(false);
                setShowSignInModal(true);
              }}
              className="text-amber-500 hover:underline"
            >
              login here
            </a>
            .
          </Balancer>
        </p>

        <div
          className="mx-auto mt-6 flex animate-fade-up items-center justify-center space-x-5 opacity-0"
          style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
        >
          <button
            className="rounded-full border border-amber-500 bg-amber-400 p-1.5 px-4 text-sm transition-all hover:bg-amber-200 hover:text-black"
            onClick={() => {
              showSignUpEmailForm(true);
              setShowSignInModal(true);
            }}
          >
            Sign Up
          </button>
        </div>
      </div>

      <div className="flex w-screen flex-col items-center justify-center px-2">
        <h2
          className="mb-10 w-[800px] max-w-full animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-2xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm md:text-3xl"
          style={{
            lineHeight: "1.5",
            animationDelay: "0.15s",
            animationFillMode: "forwards",
          }}
        >
          <Balancer>
            NeoTexto lets you read anything, anywhere, anytime.
          </Balancer>
        </h2>
        <h2
          className="mb-20 w-[800px] max-w-full animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-2xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm md:text-3xl"
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          <Balancer>Request translations and save them easily.</Balancer>
        </h2>
        <div
          className={`w-[800px] max-w-full ${
            isDesktop && "rounded-lg border-4 border-amber-300"
          }`}
        >
          <Image
            src={isDesktop ? "/trad_example.webp" : "/trad_example_mobile.webp"}
            alt="Presentation of the text generation feature."
            width={800}
            height={800}
            className="rounded-sm"
          ></Image>
        </div>
        <h2
          className="my-20 w-[800px] max-w-full animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-2xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm md:text-3xl"
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          <Balancer>
            Use the power of ChatGPT to generate texts, using the words you
            saved and a topic of interest.
          </Balancer>
        </h2>
        <div
          className={`w-[800px] max-w-full ${
            isDesktop && "rounded-lg border-4 border-amber-300"
          }`}
        >
          <Image
            src={isDesktop ? "/generation.webp" : "/generation_mobile.webp"}
            alt="Presentation of the text generation feature."
            width={800}
            height={800}
            className="rounded-sm"
          ></Image>
        </div>
        <h2
          className="my-20 w-[800px] max-w-full animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-2xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm md:text-3xl"
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          <Balancer>
            Improve yourself on mobile devices by using our Progressive Web App.
          </Balancer>
        </h2>
        <div className="mb-20 w-[300px] max-w-full">
          <Image
            src="/pwa_sample.webp"
            alt="Presentation of the progressive web app."
            width={800}
            height={800}
            className="rounded-sm"
          ></Image>
        </div>
      </div>
    </div>
  );
}
