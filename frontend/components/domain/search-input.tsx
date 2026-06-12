"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "@/components/icon";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  shortcut?: string;
  className?: string;
  autoFocus?: boolean;
}

export function SearchInput({
  placeholder = "Search…",
  value,
  defaultValue,
  onChange,
  onSubmit,
  shortcut,
  className,
  autoFocus,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const current = value ?? internalValue;

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(current);
      }}
      className={cn(
        "relative flex w-full items-center",
        className,
      )}
    >
      <span className="pointer-events-none absolute left-3 text-ink-400" aria-hidden="true">
        <Icon name="Search" size={16} />
      </span>
      <input
        type="search"
        value={current}
        autoFocus={autoFocus}
        onChange={(event) => {
          setInternalValue(event.target.value);
          onChange?.(event.target.value);
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        className="form-input h-9 w-full pl-9 pr-16"
      />
      {shortcut ? (
        <span className="pointer-events-none absolute right-3 hidden items-center gap-1 rounded-sm border border-border bg-ink-50 px-1.5 py-0.5 font-mono text-mono-sm text-ink-500 md:flex">
          {shortcut}
        </span>
      ) : null}
    </form>
  );
}

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}
