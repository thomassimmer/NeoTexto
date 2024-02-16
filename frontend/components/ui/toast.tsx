"use client";

import { useToastContext } from "@/app/providers/toast-provider";
import * as Toast from "@radix-ui/react-toast";
import CloseIcon from "../icons/close";

export default function ToastMessage() {
  const {
    showToast,
    toastCategory,
    toastPosition,
    toastMessage,
    toastTitle,
    toastDuration,
    setShowToast,
  } = useToastContext();

  let toastBackgroundColor;
  switch (toastCategory) {
    case "error":
      toastBackgroundColor = "bg-red-200";
      break;
    case "success":
      toastBackgroundColor = "bg-green-200";
      break;
    default:
      toastBackgroundColor = "bg-white";
  }

  let toastPositionCss;
  switch (toastPosition) {
    case "top-middle":
      toastPositionCss = "left-[50%] top-0 translate-x-[-50%] ";
    case "bottom-right":
      toastPositionCss = "right-0 bottom-0";
    default:
      toastPositionCss = "right-0 bottom-0";
  }

  return (
    <Toast.Provider swipeDirection="up" duration={toastDuration}>
      <Toast.Root
        className={`data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=end]:animate-swipeOut grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md p-[15px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] [grid-template-areas:_'title_action'_'description_action'] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:transition-[transform_200ms_ease-out] ${toastBackgroundColor}
        `}
        open={showToast}
        onOpenChange={setShowToast}
      >
        <Toast.Title className="mb-[5px] text-[15px] font-medium [grid-area:_title]">
          {toastTitle}
        </Toast.Title>
        <Toast.Description asChild>
          <p className="m-0 text-[13px] leading-[1.3] [grid-area:_description]">
            {toastMessage}
          </p>
        </Toast.Description>
        <button onClick={(e) => setShowToast(false)}>
          <CloseIcon className="h-6" />
        </button>
      </Toast.Root>
      <Toast.Viewport
        className={`fixed ${toastPositionCss} z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-[10px] p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]`}
      />
    </Toast.Provider>
  );
}
