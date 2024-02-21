"use client";

import { useModalContext } from "@/app/providers/modal-provider";
import { useUserContext } from "@/app/providers/user-provider";
import Modal from "@/components/shared/modal";
import { axiosPublic } from "@/lib/axios";
import * as Form from "@radix-ui/react-form";
import Image from "next/image";
import { useState } from "react";
import { LoadingDots } from "../icons";

export default function ContactModal() {
  const { showContactModal, setShowContactModal } = useModalContext();
  const { user } = useUserContext();

  const [sendButtonIsClicked, setSendButtonIsClicked] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [formSuccess, setFormSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <Modal showModal={showContactModal} setShowModal={setShowContactModal}>
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
          <h3 className="font-display text-2xl font-bold">Contact us</h3>
        </div>

        <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 md:px-16">
          <Form.Root
            className="w-full"
            onSubmit={async (event) => {
              event.preventDefault();
              setFormSuccess("");
              setFormErrors([]);
              setSendButtonIsClicked(true);

              const data = Object.fromEntries(
                new FormData(event.currentTarget),
              );

              try {
                await axiosPublic.post("/back/api/contact/", {
                  ...data,
                });

                setMessage("");
                setFormSuccess("Your message has been sent, thank you.");
              } catch (e: any) {
                if (
                  e &&
                  e.response &&
                  e.response.data &&
                  e.response.data.message
                ) {
                  setFormErrors(e.response.data.message);
                } else {
                  setFormErrors([
                    "An error occured. The mail could not be sent.",
                  ]);
                }
              }

              setSendButtonIsClicked(false);
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
                  name="email"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-amber-500 focus:ring-amber-500"
                  required
                  readOnly={user != null}
                  value={user?.email || email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Control>
            </Form.Field>

            <Form.Field className="mb-[10px] grid" name="message">
              <div className="flex items-baseline justify-between">
                <Form.Label className="mb-2 block text-sm font-medium text-gray-900">
                  Message
                </Form.Label>
                <Form.Message
                  className="text-[13px] opacity-[0.8]"
                  match="valueMissing"
                >
                  Please enter a message
                </Form.Message>
                <Form.Message
                  className="text-[13px] opacity-[0.8]"
                  match="tooLong"
                >
                  Your message is too long. The maximum number of characters is
                  200.
                </Form.Message>
              </div>
              <Form.Control asChild>
                <textarea
                  rows={5}
                  id="message"
                  name="message"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-amber-500 focus:ring-amber-500"
                  required
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                  maxLength={200}
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

            <div className="mt-4 flex gap-x-4">
              <Form.Submit asChild>
                <button
                  type="submit"
                  disabled={sendButtonIsClicked}
                  className={`${
                    sendButtonIsClicked
                      ? "cursor-not-allowed border-gray-200 bg-gray-100"
                      : "border border-gray-200 bg-white text-black hover:bg-gray-50"
                  } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75`}
                >
                  {sendButtonIsClicked ? (
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
        </div>
      </div>
    </Modal>
  );
}
