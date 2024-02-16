import { useModalContext } from "@/app/providers/modal-provider";
import { axiosPublic } from "@/lib/axios";
import { ErrorFormSignInInterface } from "@/types/types";
import * as Form from "@radix-ui/react-form";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoadingDots } from "../icons";

export default function SignInForm({
  signInClicked,
  setSignInClicked,
  showSignInEmailForm,
  showResetPasswordForm,
}) {
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const router = useRouter();
  const { setShowSignInModal } = useModalContext();
  const [emailVerificationLinkIsSending, setEmailVerificationLinkIsSending] =
    useState(false);
  const [emailVerificationLinkWasSent, setEmailVerificationLinkWasSent] =
    useState(false);
  const [email, setEmail] = useState("");

  const sendEmailVerificationLink = async () => {
    setEmailVerificationLinkIsSending(true);

    const res = await axiosPublic.post(
      "/back/api/auth/registration/resend-email/",
      {
        email,
      },
      {
        withCredentials: true, // Necessary to pass csrf token
      },
    );

    setEmailVerificationLinkWasSent(true);
    setEmailVerificationLinkIsSending(false);
  };

  const renderEmailVerificationLink = () => {
    return (
      <>
        {!emailVerificationLinkIsSending && (
          <Link
            href="#"
            onClick={(e) => sendEmailVerificationLink()}
            className="mx-1 hover:underline"
          >
            Click here to send another verification email.
          </Link>
        )}

        {!emailVerificationLinkIsSending && emailVerificationLinkWasSent && (
          <p className="py-1 text-xs text-green-500">
            A new verification email was sent.
          </p>
        )}
      </>
    );
  };

  return (
    <Form.Root
      className="w-full"
      onSubmit={async (event) => {
        event.preventDefault();
        setSignInClicked(true);
        setEmailVerificationLinkWasSent(false);
        setEmailVerificationLinkIsSending(false);
        setFormErrors([]);

        const data = Object.fromEntries(new FormData(event.currentTarget));

        try {
          let response: any = await signIn("credentials", {
            email: data.email,
            password: data.password,
            is_registration: false,
            redirect: false,
          });

          if (response.error) {
            const responseError = JSON.parse(response.error);
            const error: ErrorFormSignInInterface = responseError.errors;
            let errorMsgs: string[] = [];

            for (let field of [
              error.email,
              error.password,
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
            router.push("/");
            router.refresh();
          }
        } catch (errors) {
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

      {formErrors &&
        formErrors.map((error, i) => (
          <p key={i} className="py-1 text-xs text-red-500">
            {error}
            {error == "E-mail is not verified." &&
              renderEmailVerificationLink()}
          </p>
        ))}

      <Link
        href="#"
        onClick={() => {
          showResetPasswordForm(true);
          showSignInEmailForm(false);
        }}
        className="text-sm text-gray-400 hover:underline"
      >
        Forgot your password ? Ask for a new one here.
      </Link>

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
            showSignInEmailForm(false);
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
                <p>Sign in</p>
              </>
            )}
          </button>
        </Form.Submit>
      </div>
    </Form.Root>
  );
}
