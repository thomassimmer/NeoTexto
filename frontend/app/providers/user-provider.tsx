"use client";

import useAxiosAuth from "@/lib/hooks/use-axios-auth";
import { CustomUser } from "@/types/types";
import { useSession } from "next-auth/react";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useDefinitionContext } from "./definition-provider";
import { useIntroductionContext } from "./introduction-dialog-provider";

interface UserContextInterface {
  user: CustomUser | null;
  setUser: Dispatch<SetStateAction<CustomUser | null>>;
}

const UserContext = createContext({} as UserContextInterface);

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const axiosPublic = useAxiosAuth();

  const { data: session }: any = useSession();
  const { setShowIntroductionDialog } = useIntroductionContext();
  const { setTranslationLanguage } = useDefinitionContext();

  const [user, setUser] = useState<CustomUser | null>(null);

  useEffect(() => {
    if (session) {
      const fetchUser = async () => {
        const response = await axiosPublic.get(
          `/back/api/users/${session?.user.userId}/`,
        );

        const newUserInfo: CustomUser = response.data;
        setUser(newUserInfo);

        if (newUserInfo.motherTongue) {
          setTranslationLanguage(newUserInfo.motherTongue);
        }

        if (!newUserInfo.hasFinishedIntro || !newUserInfo.motherTongue) {
          setShowIntroductionDialog(true);
        } else {
          setShowIntroductionDialog(false);
        }
      };

      fetchUser();
    } else {
      setUser(null);
    }
  }, [session, axiosPublic, setShowIntroductionDialog, setTranslationLanguage]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => {
  return useContext(UserContext);
};
