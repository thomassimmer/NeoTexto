"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface IntroductionContextInterface {
  showIntroductionDialog: boolean;
  showHelpDialog: boolean;
  setShowIntroductionDialog: Dispatch<SetStateAction<boolean>>;
  setShowHelpDialog: Dispatch<SetStateAction<boolean>>;
}

const IntroductionContext = createContext({} as IntroductionContextInterface);

export default function IntroductionContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showIntroductionDialog, setShowIntroductionDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  return (
    <IntroductionContext.Provider
      value={{
        showIntroductionDialog,
        showHelpDialog,
        setShowIntroductionDialog,
        setShowHelpDialog,
      }}
    >
      {children}
    </IntroductionContext.Provider>
  );
}

export const useIntroductionContext = () => {
  return useContext(IntroductionContext);
};
