"use client";

import { useUserContext } from "@/app/providers/user-provider";
import UserDropdown from "@/components/navbar/user-dropdown";
import NotConnectedUserDropdown from "./not-connected-user-dropdown";

export default function LeftButton() {
  const { user } = useUserContext();

  return <>{user ? <UserDropdown /> : <NotConnectedUserDropdown />}</>;
}
