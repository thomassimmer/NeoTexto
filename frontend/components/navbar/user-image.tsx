"use client";

import { useUserContext } from "@/app/providers/user-provider";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { HiUserCircle } from "react-icons/hi";

export default function UserImage() {
  const { user }: any = useUserContext();
  const { data: session } = useSession();
  const { email, image } = user || {};

  if (!image || !session || !session.user || !session.user.image)
    return (
      <HiUserCircle className="h-12 w-12 text-gray-300" aria-hidden="true" />
    );

  return (
    <Image
      alt={email}
      src={image || (session && session.user && session.user.image)}
      width={40}
      height={40}
    />
  );
}
