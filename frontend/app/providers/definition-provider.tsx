"use client";

import useAxiosAuth from "@/lib/hooks/use-axios-auth";
import {
  DefinitionInterface,
  LanguageInterface,
  TranslationProvider,
  UserTranslationInterface,
} from "@/types/types";
import { useSession } from "next-auth/react";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface DefinitionContextInterface {
  definitionAreaIsVisible: boolean;
  definitionContext: DefinitionInterface | null;
  userTranslations: UserTranslationInterface[];
  indexesWordFocused: number[];
  definitionAreaIsLoading: boolean;
  translationProvider: TranslationProvider | null;
  translationLanguage: LanguageInterface | null;
  setDefinitionAreaIsVisible: Dispatch<SetStateAction<boolean>>;
  setDefinitionContext: Dispatch<SetStateAction<DefinitionInterface | null>>;
  setUserTranslations: Dispatch<SetStateAction<UserTranslationInterface[]>>;
  setIndexesWordFocused: Dispatch<SetStateAction<number[]>>;
  setDefinitionAreaIsLoading: Dispatch<SetStateAction<boolean>>;
  setTranslationProvider: Dispatch<SetStateAction<TranslationProvider | null>>;
  setTranslationLanguage: Dispatch<SetStateAction<LanguageInterface | null>>;
}

const DefinitionContext = createContext({} as DefinitionContextInterface);

export default function DefinitionContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const axiosPublic = useAxiosAuth();

  const { status }: any = useSession();

  const [definitionContext, setDefinitionContext] =
    useState<DefinitionInterface | null>(null);
  const [definitionAreaIsVisible, setDefinitionAreaIsVisible] = useState(false);
  const [userTranslations, setUserTranslations] = useState<
    UserTranslationInterface[]
  >([]);
  const [indexesWordFocused, setIndexesWordFocused] = useState<number[]>([]);
  const [definitionAreaIsLoading, setDefinitionAreaIsLoading] =
    useState<boolean>(false);
  const [translationProvider, setTranslationProvider] =
    useState<TranslationProvider | null>(null);
  const [translationLanguage, setTranslationLanguage] =
    useState<LanguageInterface | null>(null);

  useEffect(() => {
    if (status == "authenticated") {
      const fetchTexts = async () => {
        const res = await axiosPublic.get("/back/api/user-translations/");
        const userTranslations: UserTranslationInterface[] = await res.data;
        if (userTranslations) {
          setUserTranslations(userTranslations);
        }
      };

      fetchTexts();
    }
  }, [status, axiosPublic]);

  return (
    <>
      <DefinitionContext.Provider
        value={{
          definitionAreaIsVisible,
          definitionContext,
          userTranslations,
          indexesWordFocused,
          definitionAreaIsLoading,
          translationProvider,
          translationLanguage,
          setDefinitionAreaIsVisible,
          setDefinitionContext,
          setUserTranslations,
          setIndexesWordFocused,
          setDefinitionAreaIsLoading,
          setTranslationProvider,
          setTranslationLanguage,
        }}
      >
        {children}
      </DefinitionContext.Provider>
    </>
  );
}

export const useDefinitionContext = () => {
  return useContext(DefinitionContext);
};
