"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Icon, type IconName } from "@/components/icon";
import { cn } from "@/lib/utils";

export interface TabItem {
  label: string;
  value: string;
  icon?: IconName;
  count?: number;
  href?: string;
}

interface TabsProps {
  items: TabItem[];
  paramName?: string;
  className?: string;
}

export function Tabs({ items, paramName = "tab", className }: TabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [localValue, setLocalValue] = useState<string | null>(null);

  const activeValue = localValue ?? searchParams?.get(paramName) ?? items[0]?.value;

  return (
    <div
      role="tablist"
      className={cn(
        "flex flex-wrap items-center gap-1 border-b border-border",
        className,
      )}
    >
      {items.map((item) => {
        const isActive = item.value === activeValue;
        const target = item.href ?? `${pathname}?${paramName}=${item.value}`;
        if (item.href) {
          return (
            <Link
              key={item.value}
              href={item.href}
              role="tab"
              aria-selected={isActive}
              className={cn(
                "flex items-center gap-2 border-b-2 px-3 py-2 text-body-sm transition-colors",
                isActive
                  ? "border-brand text-brand"
                  : "border-transparent text-ink-500 hover:text-ink-900",
              )}
            >
              {item.icon ? <Icon name={item.icon} size={14} /> : null}
              <span>{item.label}</span>
              {typeof item.count === "number" ? (
                <span className="font-mono text-mono-sm text-ink-500">{item.count}</span>
              ) : null}
            </Link>
          );
        }
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => {
              setLocalValue(item.value);
              const params = new URLSearchParams(Array.from(searchParams?.entries() ?? []));
              params.set(paramName, item.value);
              router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            }}
            className={cn(
              "flex items-center gap-2 border-b-2 px-3 py-2 text-body-sm transition-colors",
              isActive
                ? "border-brand text-brand"
                : "border-transparent text-ink-500 hover:text-ink-900",
            )}
          >
            {item.icon ? <Icon name={item.icon} size={14} /> : null}
            <span>{item.label}</span>
            {typeof item.count === "number" ? (
              <span className="font-mono text-mono-sm text-ink-500">{item.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
