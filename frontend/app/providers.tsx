"use client";

import GeneratedTextsProvider from "@/app/providers/generated-texts-provider";
import { SessionProvider } from "next-auth/react";
import DefinitionContextProvider from "./providers/definition-provider";
import IntroductionContextProvider from "./providers/introduction-dialog-provider";
import LanguageProvider from "./providers/language-provider";
import ModalContextProvider from "./providers/modal-provider";
import ToastContextProvider from "./providers/toast-provider";
import UserProvider from "./providers/user-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionProvider>
        <IntroductionContextProvider>
          <DefinitionContextProvider>
            <UserProvider>
              <LanguageProvider>
                <GeneratedTextsProvider>
                  <ModalContextProvider>
                    <ToastContextProvider>{children}</ToastContextProvider>
                  </ModalContextProvider>
                </GeneratedTextsProvider>
              </LanguageProvider>
            </UserProvider>
          </DefinitionContextProvider>
        </IntroductionContextProvider>
      </SessionProvider>
    </>
  );
}
