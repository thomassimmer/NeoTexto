"use client";

import { useModalContext } from "@/app/providers/modal-provider";
import { ErrorFormSignUpInterface } from "@/types/types";
import * as Form from "@radix-ui/react-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoadingDots } from "../icons";

export default function SignUpForm({
  signInClicked,
  setSignInClicked,
  showSignUpEmailForm,
}) {
  const [formSuccess, setFormSuccess] = useState<string>("");
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const router = useRouter();
  const { setShowSignInModal } = useModalContext();

  return (
    <Form.Root
      className="w-full"
      onSubmit={async (event) => {
        event.preventDefault();
        setSignInClicked(true);

        const data = Object.fromEntries(new FormData(event.currentTarget));

        try {
          let response: any = await signIn("credentials", {
            email: data.email,
            password1: data.password,
            password2: data.confirmPassword,
            is_registration: true,
            redirect: false,
          });
          if (response.error) {
            if (response.error == "AccessDenied") {
              setFormSuccess(
                "A email was sent to verify your address. You need to open it and click on the link inside to connect to NeoTexto.",
              );
              setSignInClicked(false);
              return;
            }

            const responseError = JSON.parse(response.error);
            const error: ErrorFormSignUpInterface = responseError.errors;
            let errorMsgs: string[] = [];

            for (let field of [
              error.email,
              error.password1,
              error.password2,
              error.nonFieldErrors,
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
            setShowSignInModal(false);
            router.refresh();
          }
        } catch (e) {
          // console.log(e);
          setFormErrors(["An error occured."]);
        }
        setSignInClicked(false);
      }}
    >
      <Form.Field className="mb-[10px] grid" name="email">
        <div className="flex items-baseline justify-between">
          <Form.Label className="mb-2 block text-sm font-medium text-gray-900">
            Email
          </Form.Label>
          <Form.Message
            className="text-[13px] opacity-[0.8]"
            match="valueMissing"
          >
            Please enter your email
          </Form.Message>
          <Form.Message
            className="text-[13px] opacity-[0.8]"
            match="typeMismatch"
          >
            Please provide a valid email
          </Form.Message>
        </div>
        <Form.Control asChild>
          <input
            type="email"
            id="email"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-amber-500 focus:ring-amber-500"
            required
          />
        </Form.Control>
      </Form.Field>
      <Form.Field className="mb-[10px] grid" name="password">
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
            id="password"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-amber-500 focus:ring-amber-500"
            required
          />
        </Form.Control>
      </Form.Field>
      <Form.Field className="mb-[10px] grid" name="confirmPassword">
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

              while (entry && entry.value[0] != "password") {
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
            id="confirmPassword"
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

      {formSuccess && <p className="text-xs text-green-500">{formSuccess}</p>}

      <div className="mt-4 flex gap-x-4">
        <button
          type="button"
          disabled={signInClicked}
          className={`${
            signInClicked
              ? "cursor-not-allowed border-gray-200 bg-gray-100"
              : "border border-gray-200 bg-white text-black hover:bg-gray-50"
          } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75`}
          onClick={() => {
            showSignUpEmailForm(false);
          }}
        >
          <p>Come back</p>
        </button>
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
                <p>Sign up</p>
              </>
            )}
          </button>
        </Form.Submit>
      </div>
    </Form.Root>
  );
}
