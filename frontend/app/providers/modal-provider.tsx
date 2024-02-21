"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUserContext } from "./user-provider";

interface ModalContextInterface {
  showSignInModal: boolean;
  showContactModal: boolean;
  signInEmailFormIsVisible: boolean;
  signUpEmailFormIsVisible: boolean;
  setShowSignInModal: Dispatch<SetStateAction<boolean>>;
  setShowContactModal: Dispatch<SetStateAction<boolean>>;
  showSignInEmailForm: Dispatch<SetStateAction<boolean>>;
  showSignUpEmailForm: Dispatch<SetStateAction<boolean>>;
}

const ModalContext = createContext({} as ModalContextInterface);

export default function ModalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUserContext();

  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [signInEmailFormIsVisible, showSignInEmailForm] = useState(false);
  const [signUpEmailFormIsVisible, showSignUpEmailForm] = useState(false);

  useEffect(() => {
    if (user) {
      setShowSignInModal(false);
    }
  }, [user]);

  return (
    <ModalContext.Provider
      value={{
        showSignInModal,
        showContactModal,
        signInEmailFormIsVisible,
        signUpEmailFormIsVisible,
        setShowSignInModal,
        setShowContactModal,
        showSignInEmailForm,
        showSignUpEmailForm,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export const useModalContext = () => {
  return useContext(ModalContext);
};
