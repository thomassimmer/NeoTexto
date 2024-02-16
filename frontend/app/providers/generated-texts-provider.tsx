"use client";

import useAxiosAuth from "@/lib/hooks/use-axios-auth";
import { TextInterface } from "@/types/types";
import { useSession } from "next-auth/react";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLanguageContext } from "./language-provider";

interface GeneratedTextsContextInterface {
  idxTextFocusedOn: string;
  generatedTexts: TextInterface[];
  textPanelIsVisible: boolean;
  setIdxTextFocusedOn: Dispatch<SetStateAction<string>>;
  setGeneratedTexts: Dispatch<SetStateAction<TextInterface[]>>;
  setTextPanelIsVisible: Dispatch<SetStateAction<boolean>>;
}

const GeneratedTextsContext = createContext(
  {} as GeneratedTextsContextInterface,
);

export default function GeneratedTextsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [textPanelIsVisible, setTextPanelIsVisible] = useState(false);
  const [generatedTexts, setGeneratedTexts] = useState<TextInterface[]>([]);
  const [idxTextFocusedOn, setIdxTextFocusedOn] = useState("-1");
  const axiosPublic = useAxiosAuth();
  const { status }: any = useSession();
  const { setTextLanguage, languages } = useLanguageContext();

  const fetchTexts = useCallback(async () => {
    const res = await axiosPublic.get("/back/api/texts/");
    const userTexts: TextInterface[] = await res.data;

    if (userTexts.length > 0) {
      setGeneratedTexts(userTexts);
      setTextLanguage(userTexts[userTexts.length - 1].language);
    }
  }, [axiosPublic, setTextLanguage]);

  // useEffect to make API call the first time
  useEffect(() => {
    if (status == "authenticated") {
      fetchTexts();
    }
  }, [status, fetchTexts]);

  // useEffect to make API call every second if any text has not finished generation
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchTexts();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Check if any text has not finished generation
    const shouldMakeAPICall = generatedTexts.some(
      (text) => !text.hasFinishedGeneration,
    );

    // If at least one text has not finished generation, make the API call every second
    if (shouldMakeAPICall) {
      const intervalId = setInterval(fetchData, 2000);

      // Clean up the interval when the component unmounts or when the dependency changes
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [generatedTexts, fetchTexts]);

  return (
    <>
      <GeneratedTextsContext.Provider
        value={{
          idxTextFocusedOn,
          generatedTexts,
          textPanelIsVisible,
          setIdxTextFocusedOn,
          setGeneratedTexts,
          setTextPanelIsVisible,
        }}
      >
        {children}
      </GeneratedTextsContext.Provider>
    </>
  );
}

export const useGeneratedTexts = () => {
  return useContext(GeneratedTextsContext);
};
