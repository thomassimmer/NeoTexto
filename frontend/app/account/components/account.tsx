"use client";

import { useToastContext } from "@/app/providers/toast-provider";
import { useUserContext } from "@/app/providers/user-provider";
import { LoadingDots } from "@/components/icons";
import { axiosPublic } from "@/lib/axios";
import { CustomUser, ErrorFormUpdateProfileInterface } from "@/types/types";
import * as Form from "@radix-ui/react-form";
import * as Separator from "@radix-ui/react-separator";
import Image from "next/image";
import { useState } from "react";
import { HiUserCircle } from "react-icons/hi";
import LanguageSelector from "../../../components/shared/language-selector";

export default function Account() {
  const { user, setUser } = useUserContext();
  const { email, image } = user || {};
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [saveClicked, setSaveClicked] = useState(false);
  const [displayedPicture, setDisplayedPicture] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const {
    setToastCategory,
    setToastMessage,
    setToastTitle,
    setShowToast,
    setToastPosition,
    setToastDuration,
  } = useToastContext();
  const [selectedLanguage, setSelectedLanguage] = useState(user && user.motherTongue);

  if (image && !displayedPicture) {
    setDisplayedPicture(image);
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
      setDisplayedPicture(URL.createObjectURL(file));
    }
  };

  if (user === null) {
    return null;
  }

  const submitForm = async (event: any) => {
    event.preventDefault();

    setFormErrors([]);
    setSaveClicked(true);

    const data = Object.fromEntries(new FormData(event.currentTarget));

    let dataToSend: any = {
      email: data.email,
    };

    if (
      !user.motherTongue ||
      data.mothertongue != user.motherTongue.id.toString()
    ) {
      dataToSend.motherTongue = data.motherTongue;
    }

    if (data.userphoto && displayedPicture != image) {
      dataToSend.image = data.userphoto;
    }

    if (data.password || data.confirmPassword) {
      if (data.password != data.confirmPassword) {
        setFormErrors(["Passwords don't match."]);
        setSaveClicked(false);
        return;
      }
      dataToSend.password = data.password;
    }

    try {
      const response = await axiosPublic.put(
        `/back/api/users/${user && user.userId}/`,
        {
          hasFinishedIntro: user.hasFinishedIntro,
          ...dataToSend,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const newUserInfo: CustomUser = response.data;

      setUser(newUserInfo);
      setSaveClicked(false);
      setPassword("");
      setConfirmPassword("");

      setToastCategory("success");
      setToastTitle("Success !");
      setToastDuration(3000);
      setToastPosition("bottom-right");
      setToastMessage(`Your changes are saved.`);
      setShowToast(true);
    } catch (e: any) {
      if (e.response.data) {
        const error: ErrorFormUpdateProfileInterface = e.response.data;
        let errorMsgs: string[] = [];

        for (let prop in error) {
          if (error[prop]) {
            errorMsgs.push(error[prop]);
          }
        }

        if (errorMsgs) {
          setFormErrors(errorMsgs);
        }
      }
      setSaveClicked(false);
    }
  };

  return (
    <Form.Root className="flex w-full flex-col gap-y-4" onSubmit={submitForm}>
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Settings
      </h2>

      <Form.Field name="mother_tongue">
        <div className="flex items-baseline justify-between">
          <Form.Label className="mb-2 block text-sm font-medium text-gray-900">
            Language
          </Form.Label>
          <Form.Message
            className="text-[13px] opacity-[0.8]"
            match="valueMissing"
          >
            Please enter your mother tongue
          </Form.Message>
        </div>
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          className="h-[40px] w-[200px]"
        />
        <Form.Control asChild>
          <input
            type="text"
            id="mother_tongue"
            name="mother_tongue"
            className="hidden"
            value={selectedLanguage ? selectedLanguage.id : ""}
            required
          />
        </Form.Control>
      </Form.Field>

      <Separator.Root className="my-4 bg-amber-100 data-[orientation=horizontal]:h-[2px] data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-[2px]" />

      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Personal Information
      </h2>

      <Form.Field className="mb-[10px] grid" name="userphoto">
        <div className="flex items-baseline justify-between">
          <Form.Label className="mb-2 block text-sm font-medium text-gray-900">
            Photo
          </Form.Label>
          {/* TODO: This message is not working. Not urgent. Wait for Radix to implement it. */}
          <Form.Message
            name="userphoto"
            className="text-[13px] opacity-[0.8]"
            match={(value, formData) =>
              !value.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)
            }
          >
            This file is not an image
          </Form.Message>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-3 overflow-auto">
          {displayedPicture ? (
            <div className="flex h-12 items-center justify-center overflow-hidden rounded-full border border-gray-300 transition-all duration-75 active:scale-95 sm:h-9 sm:w-9">
              <Image
                alt="User Photo"
                src={displayedPicture}
                width={48}
                height={48}
              />
            </div>
          ) : (
            <HiUserCircle
              className="h-12 w-12 text-gray-300"
              aria-hidden="true"
            />
          )}
          <Form.Control asChild>
            <input
              id="userphoto"
              type="file"
              className="block rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900
              file:mr-4 file:rounded-md file:border-0
              file:bg-amber-300 file:px-4
              file:py-2.5 file:text-sm
              file:font-semibold file:text-white
              hover:file:bg-amber-400"
              aria-describedby="file_input_help"
              onChange={handlePhotoChange}
              accept="image/*"
            />
          </Form.Control>
        </div>
      </Form.Field>

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

        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-500 sm:max-w-md">
          <Form.Control asChild>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="off"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-amber-500 focus:ring-amber-500"
              defaultValue={email}
              required
            />
          </Form.Control>
        </div>
      </Form.Field>

      <Form.Field className="mb-[10px] grid" name="password">
        <div className="flex items-baseline justify-between">
          <Form.Label className="mb-2 block text-sm font-medium text-gray-900">
            New Password
          </Form.Label>
          <Form.Message
            className="text-[13px] opacity-[0.8]"
            match="valueMissing"
          >
            Please enter a password
          </Form.Message>
        </div>
        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-500 sm:max-w-md">
          <Form.Control asChild>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="new-password"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-amber-500 focus:ring-amber-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Control>
        </div>
      </Form.Field>

      <Form.Field className="mb-[10px] grid" name="confirmPassword">
        <div className="flex items-baseline justify-between">
          <Form.Label className="mb-2 block text-sm font-medium text-gray-900">
            Confirm New Password
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
        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-500 sm:max-w-md">
          <Form.Control asChild>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-amber-500 focus:ring-amber-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Control>
        </div>
      </Form.Field>

      {formErrors &&
        formErrors.map((error, i) => (
          <p key={i} className="text-xs text-red-500">
            {error}
          </p>
        ))}

      <div className="mt-4 flex gap-x-4">
        <Form.Submit asChild>
          <button
            type="submit"
            disabled={saveClicked}
            className={`w-full rounded-md border-0 px-3.5 py-2 shadow-sm hover:shadow-md focus:border-green-500 focus:ring-0 sm:text-sm sm:leading-6 ${
              saveClicked
                ? "cursor-not-allowed bg-amber-300"
                : "bg-amber-200 text-black hover:bg-amber-300"
            }`}
          >
            {saveClicked ? (
              <LoadingDots color="#808080" />
            ) : (
              <>
                <p>Save your changes</p>
              </>
            )}
          </button>
        </Form.Submit>
      </div>
    </Form.Root>
  );
}
