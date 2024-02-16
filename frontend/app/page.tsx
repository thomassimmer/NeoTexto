"use client";

import { SignInModal } from "@/components/auth/sign-in-modal";
import Footer from "@/components/footer";
import HomeConnected from "@/components/home/connected";
import { ContactModal } from "@/components/home/contact-modal";
import HomeDisconnected from "@/components/home/disconnected";
import Navbar from "@/components/navbar";
import { HelpDialog } from "@/components/shared/help-dialog";
import { IntroductionDialog } from "@/components/shared/introduction-dialog";
import ToastMessage from "@/components/ui/toast";
import { useEffect } from "react";
import { useToastContext } from "./providers/toast-provider";
import { useUserContext } from "./providers/user-provider";

export default function Home({ searchParams }) {
  const { user } = useUserContext();
  const {
    setToastCategory,
    setToastMessage,
    setToastPosition,
    setToastTitle,
    setShowToast,
    setToastDuration,
  } = useToastContext();

  useEffect(() => {
    if (searchParams) {
      if (searchParams.error) {
        setToastMessage(searchParams.error);
        setToastTitle("Error");
        setToastPosition("top-middle");
        setToastCategory("error");
        setShowToast(true);
        setToastDuration(3000);
      }
    }
  }, [
    searchParams,
    setShowToast,
    setToastMessage,
    setToastPosition,
    setToastTitle,
    setToastCategory,
    setToastDuration,
  ]);

  return (
    <>
      <ContactModal />
      <SignInModal />
      <ToastMessage />
      <IntroductionDialog />
      <HelpDialog />
      <Navbar />
      <main className="relative top-16 w-full">
        {user ? <HomeConnected /> : <HomeDisconnected />}
      </main>
      <Footer />
    </>
  );
}
