import Link from "next/link";
import { Fragment } from "react";
import { Icon } from "@/components/icon";

export interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-body-sm text-ink-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={`${item.label}-${index}`}>
              <li>
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="rounded-sm px-1 py-0.5 transition-colors hover:text-ink-900"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="px-1 py-0.5 text-ink-800" aria-current={isLast ? "page" : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
              {!isLast ? (
                <li aria-hidden="true" className="text-ink-400">
                  <Icon name="ChevronRight" size={12} />
                </li>
              ) : null}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
