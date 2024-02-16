"use client";

import { useUserContext } from "@/app/providers/user-provider";
import Popover from "@/components/shared/popover";
import useWindowSize from "@/lib/hooks/use-window-size";
import {
  ListBulletIcon,
  PersonIcon,
  PinRightIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UserImage from "./user-image";

export default function UserDropdown() {
  const [openPopover, setOpenPopover] = useState(false);
  const router = useRouter();
  const { user } = useUserContext();
  const { isMobile } = useWindowSize();

  return (
    <Popover
      content={
        <nav className="w-full rounded-md bg-white p-2 sm:w-56">
          <button
            className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
            onClick={() => {
              router.push("/practice");
              setOpenPopover(false);
            }}
          >
            <RocketIcon className="h-4 w-4" />
            <p className="text-sm">Practice</p>
          </button>
          <button
            className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
            onClick={() => {
              router.push("/vocabulary");
              setOpenPopover(false);
            }}
          >
            <ListBulletIcon className="h-4 w-4" />
            <p className="text-sm">Vocabulary</p>
          </button>
          <button
            className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
            onClick={() => {
              router.push("/account");
              setOpenPopover(false);
            }}
          >
            <PersonIcon className="h-4 w-4" />
            <p className="text-sm">Account</p>
          </button>
          <button
            className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
            onClick={() => {
              signOut();
              setOpenPopover(false);
            }}
          >
            <PinRightIcon className="h-4 w-4" />
            <p className="text-sm">Logout</p>
          </button>
        </nav>
      }
      align="end"
      openPopover={openPopover}
      setOpenPopover={setOpenPopover}
    >
      <div className="flex flex-col items-center justify-center">
        <button
          onClick={() => setOpenPopover(!openPopover)}
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-amber-200 shadow-sm transition-all duration-75 hover:shadow-md active:scale-95 sm:h-9 sm:w-9"
        >
          <UserImage />
        </button>
        {isMobile && (
          <p className="relative top-2 text-[9px] italic leading-[0px] text-gray-500">
            Credit: {user?.credit}
          </p>
        )}
      </div>
    </Popover>
  );
}
