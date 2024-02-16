"use client";

import { useModalContext } from "@/app/providers/modal-provider";

export default function NotConnectedUserDropdown() {
  const { setShowSignInModal, showSignUpEmailForm } = useModalContext();

  return (
    <>
      <button
        className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
        onClick={() => {
          showSignUpEmailForm(false);
          setShowSignInModal(true);
        }}
      >
        Sign In
      </button>
    </>
  );
}
