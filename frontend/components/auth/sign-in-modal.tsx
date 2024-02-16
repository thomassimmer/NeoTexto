import { useModalContext } from "@/app/providers/modal-provider";
import SignInForm from "@/components/auth/sign-in-form";
import { Google, LoadingDots } from "@/components/icons";
import Modal from "@/components/shared/modal";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import * as Separator from "@radix-ui/react-separator";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ResetPasswordForm from "./reset-password";
import SignUpForm from "./sign-up-form";

export const SignInModal = () => {
  const {
    showSignInModal,
    signInEmailFormIsVisible,
    signUpEmailFormIsVisible,
    showSignInEmailForm,
    setShowSignInModal,
    showSignUpEmailForm,
  } = useModalContext();
  const [signInClicked, setSignInClicked] = useState(false);
  const [resetPasswordFormIsVisible, showResetPasswordForm] = useState(false);

  return (
    <Modal showModal={showSignInModal} setShowModal={setShowSignInModal}>
      <div className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-2xl md:border md:border-gray-200">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center md:px-16">
          <a href="/">
            <Image
              src="/logo.webp"
              alt="NeoTexto Logo"
              className="w-8"
              width={20}
              height={20}
            />
          </a>
          <h3 className="font-display text-2xl font-bold">Welcome</h3>
        </div>

        {signInEmailFormIsVisible ? (
          <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 md:px-16">
            <SignInForm
              signInClicked={signInClicked}
              setSignInClicked={setSignInClicked}
              showSignInEmailForm={showSignInEmailForm}
              showResetPasswordForm={showResetPasswordForm}
            />
          </div>
        ) : signUpEmailFormIsVisible ? (
          <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 md:px-16">
            <button
              disabled={signInClicked}
              className={`${
                signInClicked
                  ? "cursor-not-allowed border-gray-200 bg-gray-100"
                  : "border border-gray-200 bg-white text-black hover:bg-gray-50"
              } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75`}
              onClick={async (e) => {
                e.preventDefault();
                setSignInClicked(true);
                await signIn("google");
                setSignInClicked(false);
              }}
            >
              {signInClicked ? (
                <LoadingDots color="#808080" />
              ) : (
                <>
                  <Google className="h-5 w-5" />
                  <p>Sign Up with Google</p>
                </>
              )}
            </button>

            <Separator.Root className="my-4 bg-gray-200 data-[orientation=horizontal]:h-[2px] data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-[2px]" />
            <p className="text-center text-sm text-gray-500">
              Or with your email address
            </p>
            <SignUpForm
              signInClicked={signInClicked}
              setSignInClicked={setSignInClicked}
              showSignUpEmailForm={showSignUpEmailForm}
            />
          </div>
        ) : resetPasswordFormIsVisible ? (
          <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 md:px-16">
            <ResetPasswordForm
              signInClicked={signInClicked}
              setSignInClicked={setSignInClicked}
              showSignInEmailForm={showSignInEmailForm}
              showResetPasswordForm={showResetPasswordForm}
            />
          </div>
        ) : (
          <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 md:px-16">
            <button
              disabled={signInClicked}
              className={`${
                signInClicked
                  ? "cursor-not-allowed border-gray-200 bg-gray-100"
                  : "border border-gray-200 bg-white text-black hover:bg-gray-50"
              } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75`}
              onClick={async (e) => {
                e.preventDefault();
                setSignInClicked(true);
                await signIn("google");
                setSignInClicked(false);
              }}
            >
              {signInClicked ? (
                <LoadingDots color="#808080" />
              ) : (
                <>
                  <Google className="h-5 w-5" />
                  <p>Sign In with Google</p>
                </>
              )}
            </button>
            <button
              disabled={signInClicked}
              className={`${
                signInClicked
                  ? "cursor-not-allowed border-gray-200 bg-gray-100"
                  : "border border-gray-200 bg-white text-black hover:bg-gray-50"
              } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75`}
              onClick={() => {
                showSignInEmailForm(true);
              }}
            >
              <>
                <EnvelopeClosedIcon />
                <p>Sign In with Email</p>
              </>
            </button>
            <Separator.Root className="my-4 bg-gray-200 data-[orientation=horizontal]:h-[2px] data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-[2px]" />
            <Link
              href="#"
              className={`${
                signInClicked ? "cursor-not-allowed" : ""
              } mx-auto my-1 text-sm hover:underline`}
              onClick={() => {
                showSignUpEmailForm(true);
              }}
            >
              <p>Not registered yet ? Sign up with an email</p>
            </Link>
          </div>
        )}
      </div>
    </Modal>
  );
};
