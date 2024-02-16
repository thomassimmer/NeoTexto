"use client";

import { useModalContext } from "@/app/providers/modal-provider";
import { useUserContext } from "@/app/providers/user-provider";
import { SignInModal } from "@/components/auth/sign-in-modal";
import Footer from "@/components/footer";
import { ContactModal } from "@/components/home/contact-modal";
import Navbar from "@/components/navbar";
import { HelpDialog } from "@/components/shared/help-dialog";
import { IntroductionDialog } from "@/components/shared/introduction-dialog";
import ToastMessage from "@/components/ui/toast";
import { useRouter } from "next/navigation";

export default function Page() {
  const { setShowSignInModal } = useModalContext();
  const { user } = useUserContext();
  const router = useRouter();

  if (user) {
    router.push('/');
  }

  return (
    <>
      <ContactModal />
      <SignInModal />
      <ToastMessage />
      <IntroductionDialog />
      <HelpDialog />
      <Navbar />
      <ToastMessage />
      <main className="relative top-16 flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center">
        <h1 className="text-lg">Your password has been changed.</h1>
        <p>Thank you.</p>
        <div
          className="mx-auto mt-6 flex animate-fade-up items-center justify-center space-x-5 opacity-0"
          style={{ animationDelay: "1s", animationFillMode: "forwards" }}
        >
          <button
            className="rounded-full border border-amber-500 bg-amber-400 p-1.5 px-4 text-sm transition-all hover:bg-amber-200"
            onClick={() => {
              setShowSignInModal(true);
            }}
          >
            Sign in
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
