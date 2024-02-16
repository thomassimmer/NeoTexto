import { useDefinitionContext } from "@/app/providers/definition-provider";
import { useGeneratedTexts } from "@/app/providers/generated-texts-provider";
import { PlusCircledIcon } from "@radix-ui/react-icons";

export default function NewTextButton({ setMobileMenuIsOpen }) {
  const { idxTextFocusedOn, setIdxTextFocusedOn } = useGeneratedTexts();
  const { setDefinitionAreaIsVisible, setIndexesWordFocused } =
    useDefinitionContext();

  return (
    <button
      className={`flex justify-between rounded-md border-0 px-3.5 py-2 shadow-sm hover:bg-amber-200 hover:shadow-md focus:border-green-500 focus:ring-0 sm:text-sm sm:leading-6 ${
        idxTextFocusedOn == "-1" ? "bg-amber-200" : "bg-amber-100"
      }`}
      onClick={() => {
        setIdxTextFocusedOn("-1");
        setMobileMenuIsOpen(false);
        setDefinitionAreaIsVisible(false);
        setIndexesWordFocused([]);
      }}
    >
      <PlusCircledIcon className="mr-2 h-6" />
      Add a new text
    </button>
  );
}
