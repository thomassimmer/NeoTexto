"use client";

import Footer from "@/components/footer";
import { ContactModal } from "@/components/home/contact-modal";
import Navbar from "@/components/navbar";
import Card from "@/components/ui/card";
import ToastMessage from "@/components/ui/toast";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useUserContext } from "../providers/user-provider";
import CreateSentenceGame from "./components/create-sentence-game";
import MissingWordGame from "./components/missing-word-game";
import { HelpDialog } from "@/components/shared/help-dialog";
import { IntroductionDialog } from "@/components/shared/introduction-dialog";

export default function Practice() {
  const { user } = useUserContext();
  const [showMissingWordGame, setShowMissingWordGame] = useState(false);
  const [showCreateSentenceGame, setShowCreateSentenceGame] = useState(false);

  if (!user) {
    return redirect("/");
  }

  const games = [
    {
      title: "Create sentences",
      description:
        "We give you a word from your list of vocabulary and you have to create a new sentence with it. ChatGPT will tell you if your sentence is correct and if it is a right use of this word.",
      onClick: () => {
        setShowCreateSentenceGame(true);
      },
    },
    {
      title: "Find the missing word",
      description:
        "We give you a sentence from your list of text that contains a word from your list of vocabulary. That word is hidden and you have to find it.",
      onClick: () => {
        setShowMissingWordGame(true);
      },
    },
  ];

  return (
    <>
      <IntroductionDialog />
      <HelpDialog />
      <ContactModal />
      <Navbar />
      <ToastMessage />
      <main className="relative top-16 min-h-[calc(100vh-4rem)] w-full">
        <div className="flex items-center justify-center">
          <div className="mx-2 my-8 flex min-h-[50vh] w-full flex-col items-center rounded border-4 border-amber-100 p-4 md:w-[768px]">
            <h1 className="mb-4 font-display text-2xl">Practice</h1>
            {showMissingWordGame ? (
              <MissingWordGame
                setShowMissingWordGame={setShowMissingWordGame}
              />
            ) : showCreateSentenceGame ? (
              <CreateSentenceGame
                setShowCreateSentenceGame={setShowCreateSentenceGame}
              />
            ) : (
              <div className="mt-10 flex flex-col gap-5 md:flex-row">
                {games.map(
                  ({ title, description, onClick }, index) => (
                    <Card
                      key={title}
                      title={title}
                      description={description}
                      onClick={onClick}
                    />
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
