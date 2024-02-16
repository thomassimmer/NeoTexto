"use client";

import { useUserContext } from "@/app/providers/user-provider";
import { SignInModal } from "@/components/auth/sign-in-modal";
import Footer from "@/components/footer";
import { ContactModal } from "@/components/home/contact-modal";
import { LoadingDots } from "@/components/icons";
import Navbar from "@/components/navbar";
import { HelpDialog } from "@/components/shared/help-dialog";
import { IntroductionDialog } from "@/components/shared/introduction-dialog";
import ToastMessage from "@/components/ui/toast";
import useAxiosAuth from "@/lib/hooks/use-axios-auth";
import { ErrorFormPasswordResetInterface } from "@/types/types";
import * as Form from "@radix-ui/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home({
  params,
}: {
  params: { uid: string; token: string };
}) {
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const axiosPublic = useAxiosAuth();
  const [formSuccess, setFormSuccess] = useState("");
  const [signInClicked, setSignInClicked] = useState(false);
  const router = useRouter();
  const { user } = useUserContext();

  if (user) {
    router.push("/");
  }

  return (
    <>
      <ContactModal />
      <SignInModal />
      <ToastMessage />
      <IntroductionDialog />
      <HelpDialog />
      <Navbar />
      <main className="relative flex min-h-screen w-full items-center justify-center">
        <Form.Root
          className="w-1/4 min-w-[300px]"
          onSubmit={async (event) => {
            event.preventDefault();
            setSignInClicked(true);
            setFormErrors([]);
            setFormSuccess("");
            const data = Object.fromEntries(new FormData(event.currentTarget));

            try {
              await axiosPublic.post(
                "/back/api/auth/password/reset/confirm/",
                {
                  uid: params.uid,
                  token: params.token,
                  new_password1: data.new_password1,
                  new_password2: data.new_password2,
                },
                {
                  withCredentials: true, // Necessary to pass csrf token
                },
              );

              router.push("/password-reset/confirm/done/");
            } catch (e: any) {
              if (e.response && e.response.status == 429) {
                setFormErrors([
                  "Please wait a few minutes before asking for a new email.",
                ]);
              } else if (e.response.data) {
                const error: ErrorFormPasswordResetInterface = e.response.data;

                let errorMsgs: string[] = [];

                for (let field of [
                  error.uid,
                  error.newPassword1,
                  error.newPassword2,
                  error.token,
                ]) {
                  if (field) {
                    for (let e of field) {
                      errorMsgs.push(e);
                    }
                  }
                }
                if (errorMsgs) {
                  setFormErrors(errorMsgs);
                }
              } else {
                setFormErrors(["An error occured."]);
              }
            }

            setSignInClicked(false);
          }}
        >
          <Form.Field className="mb-[10px] grid" name="new_password1">
            <div className="flex items-baseline justify-between">
              <Form.Label className="mb-2 block text-sm font-medium text-gray-900">
                Password
              </Form.Label>
              <Form.Message
                className="text-[13px] opacity-[0.8]"
                match="valueMissing"
              >
                Please enter a password
              </Form.Message>
            </div>
            <Form.Control asChild>
              <input
                type="password"
                id="new_password1"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-amber-500 focus:ring-amber-500"
                required
              />
            </Form.Control>
          </Form.Field>

          <Form.Field className="mb-[10px] grid" name="new_password2">
            <div className="flex items-baseline justify-between">
              <Form.Label className="mb-2 block text-sm font-medium text-gray-900">
                Confirm password
              </Form.Label>
              <Form.Message
                className="text-[13px] opacity-[0.8]"
                match="valueMissing"
              >
                Please enter a password
              </Form.Message>
              <Form.Message
                className="text-[13px] opacity-[0.8]"
                match={(value: string, formData: FormData) => {
                  const entries = formData.entries();
                  let entry = entries.next();

                  while (entry && entry.value[0] != "new_password1") {
                    entry = entries.next();
                  }
                  return !(entry && value == entry.value[1]);
                }}
              >
                Passwords do not match
              </Form.Message>
            </div>
            <Form.Control asChild>
              <input
                type="password"
                id="new_password2"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-amber-500 focus:ring-amber-500"
                required
              />
            </Form.Control>
          </Form.Field>

          {formErrors &&
            formErrors.map((error, i) => (
              <p key={i} className="text-xs text-red-500">
                {error}
              </p>
            ))}
          {formSuccess && (
            <p className="text-xs text-green-500">{formSuccess}</p>
          )}

          <Form.Submit asChild>
            <button
              type="submit"
              disabled={signInClicked}
              className={`${
                signInClicked
                  ? "cursor-not-allowed border-gray-200 bg-gray-100"
                  : "border border-gray-200 bg-white text-black hover:bg-gray-50"
              } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75`}
            >
              {signInClicked ? (
                <LoadingDots color="#808080" />
              ) : (
                <>
                  <p>Set New Password</p>
                </>
              )}
            </button>
          </Form.Submit>
        </Form.Root>
      </main>
      <Footer />
    </>
  );
}
