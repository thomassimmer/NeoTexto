"use client";

import Account from "@/app/account/components/account";
import Footer from "@/components/footer";
import { ContactModal } from "@/components/home/contact-modal";
import Navbar from "@/components/navbar";
import { HelpDialog } from "@/components/shared/help-dialog";
import { IntroductionDialog } from "@/components/shared/introduction-dialog";
import ToastMessage from "@/components/ui/toast";
import { redirect } from "next/navigation";
import { useUserContext } from "../providers/user-provider";

export default function AccountPage() {
  const { user } = useUserContext();

  if (!user) {
    return redirect("/");
  }

  return (
    <>
      <IntroductionDialog />
      <HelpDialog />
      <ContactModal />
      <Navbar />
      <ToastMessage />
      <main className="relative top-16 min-h-[calc(100vh-4rem)] w-full">
        <div className="flex items-center justify-center">
          <div className="mx-2 my-8 flex w-full flex-col items-center rounded border-4 border-amber-100 p-4 md:w-[768px]">
            <h1 className="mb-4 font-display text-2xl">My Account</h1>
            <Account />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
