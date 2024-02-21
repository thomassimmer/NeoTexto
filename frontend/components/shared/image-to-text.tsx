import { useGeneratedTexts } from "@/app/providers/generated-texts-provider";
import { useLanguageContext } from "@/app/providers/language-provider";
import { useUserContext } from "@/app/providers/user-provider";
import useAxiosAuth from "@/lib/hooks/use-axios-auth";
import { LanguageInterface, TextInterface } from "@/types/types";
import { useState } from "react";
import { LoadingDots } from "../icons";

export default function ImageToText() {
  const axiosPublic = useAxiosAuth();

  const { textLanguage, setTextLanguage } = useLanguageContext();
  const { generatedTexts, setIdxTextFocusedOn, setGeneratedTexts } =
    useGeneratedTexts();
  const { user, setUser } = useUserContext();

  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [importButtonClicked, setImportButtonClicked] = useState(false);
  const [detectButtonClicked, setDetectButtonClicked] = useState(false);

  interface DetectTextResponse {
    text?: string;
    language?: LanguageInterface;
    error?: string;
  }

  const detectTextInImage = async (data) => {
    if (!data.imagefile.size) {
      setError("You didn't select a file");
      return;
    }

    if (data.imagefile.size > 20000000) {
      setError("Your file is too big. The limit is 20MB.");
      return;
    }

    try {
      setText("");
      setError("");

      const res = await axiosPublic.post(
        "/back/api/detect-text/",
        {
          imagefile: data.imagefile,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (user) {
        user.credit -= Number(process.env.IMAGE_API_CALL_COST) || 1;
        setUser({ ...user });
      }

      const detectedTextData: DetectTextResponse = res.data;

      if (detectedTextData.language) {
        setTextLanguage(detectedTextData.language);
      }

      if (detectedTextData.text) {
        setText(detectedTextData.text);

        // Update height of the textArea to see the whole text.
        setTimeout(() => {
          let textArea = document.getElementById("pasted-text");
          if (textArea) {
            textArea.style.height = "1.5rem";
            textArea.style.height = textArea.scrollHeight + "px";
          }
        }, 100);
      } else if (detectedTextData.error) {
        setError(detectedTextData.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const importText = async () => {
    setError("");

    if (!textLanguage) {
      setError("Please select a language.");
      return;
    }

    if (text.length == 0) {
      setError("Please enter a text.");
      return;
    }

    if (text.length > 10000) {
      setError("Your text is too long. The limit is 10 000 characters.");
      return;
    }

    const res = await axiosPublic.post("/back/api/texts/", {
      text,
      language: textLanguage.id,
    });

    const textObject: TextInterface = await res.data;

    setGeneratedTexts([textObject].concat(generatedTexts));
    setIdxTextFocusedOn(textObject.id);
  };

  return (
    <div className="m-4 flex flex-col items-center justify-center gap-y-4 text-center">
      <form
        className="flex w-full flex-col items-center justify-center gap-y-4"
        onSubmit={async (event) => {
          event.preventDefault();

          setDetectButtonClicked(true);

          const data = Object.fromEntries(new FormData(event.currentTarget));
          await detectTextInImage(data);

          setDetectButtonClicked(false);
        }}
      >
        <input
          id="imagefile"
          name="imagefile"
          type="file"
          className="block max-w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900
        file:mr-4 file:rounded-md file:border-0
        file:bg-amber-300 file:px-4
        file:py-2.5 file:text-sm
        file:font-semibold file:text-white
        hover:file:bg-amber-400"
          accept="image/png, image/jpeg, image/bmp, image/webp"
        />
        <p className="text-sm text-gray-500">
          Accepted format: png, jpeg, bmp, webp. Size max.: 20MB
        </p>
        <p className="text-sm text-gray-500">We will not store your file.</p>

        <button
          type="submit"
          className="w-fit rounded-md bg-green-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
          disabled={detectButtonClicked || importButtonClicked}
        >
          {detectButtonClicked ? (
            <LoadingDots color="#808080" />
          ) : (
            "Detect text in my image"
          )}
        </button>
      </form>

      {text && (
        <form
          className="flex w-full flex-col items-center justify-center gap-y-4"
          onSubmit={async (e) => {
            e.preventDefault();

            setImportButtonClicked(true);

            await importText();

            setImportButtonClicked(false);
          }}
        >
          <textarea
            id="pasted-text"
            name="pasted-text"
            className="w-full min-w-0 flex-auto resize-none overflow-hidden rounded-md border-gray-200 bg-white/5 px-3.5 py-2 shadow-sm hover:shadow-md focus:border-green-500 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="Paste your text here..."
            onChange={(e) => {
              setText(e.target.value);
              e.target.style.height = "1.5rem";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            disabled={importButtonClicked}
            value={text}
            autoFocus
          />
          <button
            type="submit"
            className="w-fit rounded-md bg-green-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
            disabled={importButtonClicked}
          >
            {importButtonClicked ? <LoadingDots color="#808080" /> : "Import"}
          </button>
        </form>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
