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

import { cn } from "@/lib/utils";
import { TranslationProvider } from "@/types/types";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import classnames from "classnames";
import { useState } from "react";

export default function ProviderSelector({
  selectedProvider,
  setSelectedProvider,
  ...props
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={classnames(
            "flex items-center justify-between rounded-md bg-amber-100 px-3 text-sm shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-amber-500 sm:max-w-md",
            props.className,
          )}
        >
          {selectedProvider
            ? selectedProvider.toString()
            : "Select a provider..."}
          <CaretSortIcon />
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-amber-100 p-0">
        <Command>
          <CommandInput placeholder="Search a provider..." />
          <CommandEmpty>No language found.</CommandEmpty>
          <CommandGroup className="max-h-[10rem] overflow-auto">
            {Object.keys(TranslationProvider).map((provider, index) => (
              <CommandItem
                value={provider}
                key={index}
                onSelect={() => {
                  setSelectedProvider(provider);
                  setOpen(false);
                }}
              >
                <CheckIcon
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedProvider && provider === selectedProvider
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                {provider}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
