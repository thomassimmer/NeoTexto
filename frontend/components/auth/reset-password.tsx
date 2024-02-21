"use client";

import useAxiosAuth from "@/lib/hooks/use-axios-auth";
import * as Form from "@radix-ui/react-form";
import { useState } from "react";
import { LoadingDots } from "../icons";

export default function ResetPasswordForm({
  signInClicked,
  setSignInClicked,
  showSignInEmailForm,
  showResetPasswordForm,
}) {
  const axiosPublic = useAxiosAuth();

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [formSuccess, setFormSuccess] = useState("");

  return (
    <Form.Root
      className="w-full"
      onSubmit={async (event) => {
        event.preventDefault();
        setSignInClicked(true);
        setFormErrors([]);
        setFormSuccess("");
        const data = Object.fromEntries(new FormData(event.currentTarget));

        try {
          await axiosPublic.post(
            "/back/api/auth/password/reset/",
            {
              email: data.email,
            },
            {
              withCredentials: true, // Necessary to pass csrf token
            },
          );

          setFormSuccess("An email was sent to your email account.");
        } catch (e: any) {
          if (e.response && e.response.status == 429) {
            setFormErrors([
              "Please wait a few minutes before asking for a new email.",
            ]);
          } else {
            setFormErrors(["An error occured."]);
          }
        }

        setSignInClicked(false);
      }}
    >
      <p className="py-4 text-sm">
        To reset your password, please enter your email.
      </p>
      <Form.Field className="mb-[10px] grid" name="email">
        <div className="flex items-baseline justify-between">
          <Form.Label className="mb-2 block text-sm font-medium text-gray-900">
            Email
          </Form.Label>
          <Form.Message
            className="text-[13px] opacity-[0.8]"
            match="valueMissing"
          >
            Please enter your email.
          </Form.Message>
          <Form.Message
            className="text-[13px] opacity-[0.8]"
            match="typeMismatch"
          >
            Please provide a valid email.
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

      {formErrors &&
        formErrors.map((error, i) => (
          <p key={i} className="text-xs text-red-500">
            {error}
          </p>
        ))}
      {formSuccess && <p className="text-xs text-green-500">{formSuccess}</p>}

      <div className="mt-4 flex gap-x-4">
        <button
          disabled={signInClicked}
          className={`${
            signInClicked
              ? "cursor-not-allowed border-gray-200 bg-gray-100"
              : "border border-gray-200 bg-white text-black hover:bg-gray-50"
          } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75`}
          onClick={() => {
            showResetPasswordForm(false);
            showSignInEmailForm(true);
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
                <p>Send</p>
              </>
            )}
          </button>
        </Form.Submit>
      </div>
    </Form.Root>
  );
}
