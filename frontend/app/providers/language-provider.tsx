"use client";

import useAxiosAuth from "@/lib/hooks/use-axios-auth";
import { LanguageInterface } from "@/types/types";
import { useSession } from "next-auth/react";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface LanguageContextInterface {
  languages: LanguageInterface[];
  textLanguage: LanguageInterface | null;
  setLanguages: Dispatch<SetStateAction<LanguageInterface[]>>;
  setTextLanguage: Dispatch<SetStateAction<LanguageInterface | null>>;
}

const LanguageContext = createContext({} as LanguageContextInterface);

export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [languages, setLanguages] = useState<LanguageInterface[]>([]);
  const [textLanguage, setTextLanguage] = useState<LanguageInterface | null>(
    null,
  );
  const axiosPublic = useAxiosAuth();
  const { data: session }: any = useSession();

  useEffect(() => {
    if (session) {
      const fetchLanguages = async () => {
        const res = await axiosPublic.get(`/back/api/languages/`);
        const fetchedLanguages: LanguageInterface[] = await res.data;

        if (fetchedLanguages.length > 0) {
          setLanguages(fetchedLanguages);
        }
      };

      fetchLanguages();
    } else {
      setLanguages([]);
    }
  }, [session, axiosPublic]);

  return (
    <>
      <LanguageContext.Provider
        value={{
          languages,
          textLanguage,
          setLanguages,
          setTextLanguage,
        }}
      >
        {children}
      </LanguageContext.Provider>
    </>
  );
}

export const useLanguageContext = () => {
  return useContext(LanguageContext);
};
