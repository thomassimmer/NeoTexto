"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useLanguageContext } from "@/app/providers/language-provider";
import { cn } from "@/lib/utils";
import { LanguageInterface } from "@/types/types";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import classnames from "classnames";
import { useState } from "react";

export default function LanguageSelector({
  selectedLanguage,
  setSelectedLanguage,
  className,
}: {
  selectedLanguage: LanguageInterface | null;
  setSelectedLanguage: Function;
  className: string;
}) {
  const [open, setOpen] = useState(false);
  const { languages } = useLanguageContext();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={classnames(
            "flex items-center justify-between rounded-md bg-amber-100 px-3 text-sm shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-500 sm:max-w-md",
            className,
          )}
        >
          {selectedLanguage ? selectedLanguage.name : "Select a language..."}
          <CaretSortIcon />
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-amber-100 p-0">
        <Command>
          <CommandInput placeholder="Search a language..." />
          <CommandEmpty>No language found.</CommandEmpty>
          <CommandGroup className="max-h-[10rem] overflow-auto">
            {languages.map((language) => (
              <CommandItem
                value={language.name + language.code}
                key={language.id}
                onSelect={() => {
                  setSelectedLanguage(language);
                  setOpen(false);
                }}
              >
                <CheckIcon
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedLanguage && language.id === selectedLanguage.id
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                {language.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
