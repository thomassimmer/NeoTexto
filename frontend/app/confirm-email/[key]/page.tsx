"use client";

import { SignInModal } from "@/components/auth/sign-in-modal";
import Footer from "@/components/footer";
import { ContactModal } from "@/components/home/contact-modal";
import Navbar from "@/components/navbar";
import { HelpDialog } from "@/components/shared/help-dialog";
import { IntroductionDialog } from "@/components/shared/introduction-dialog";
import ToastMessage from "@/components/ui/toast";
import { axiosPublic } from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { key: string } }) {
  const router = useRouter();

  const verifyEmail = async () => {
    try {
      await axiosPublic.get(`/back/api/accounts/confirm-email/${params.key}/`);
      router.push("/confirm-email/done/");
    } catch (e) {
      // TODO: Show a proper error.
    }
  };

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
        <h1 className="text-lg">
          Please, click on this button to verify your email.
        </h1>
        <div
          className="mx-auto mt-6 flex animate-fade-up items-center justify-center space-x-5 opacity-0"
          style={{ animationDelay: "1s", animationFillMode: "forwards" }}
        >
          <button
            className="rounded-full border border-amber-500 bg-amber-400 p-1.5 px-4 text-sm transition-all hover:bg-amber-200"
            onClick={() => {
              verifyEmail();
            }}
          >
            Verify
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
