import Link from "next/link";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

interface SearchResultCardProps {
  title: string;
  href: string;
  docType: string;
  jurisdiction?: string | null;
  source?: string | null;
  summary?: string | null;
  matchReason?: string | null;
  score?: number | null;
  icon?: "document" | "rule" | "chunk";
  className?: string;
}

const iconFor: Record<NonNullable<SearchResultCardProps["icon"]>, "FileText" | "Scale" | "FileSearch"> = {
  document: "FileText",
  rule: "Scale",
  chunk: "FileSearch",
};

export function SearchResultCard({
  title,
  href,
  docType,
  jurisdiction,
  source,
  summary,
  matchReason,
  score,
  icon = "document",
  className,
}: SearchResultCardProps) {
  return (
    <article className={cn("surface p-4", className)}>
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-ink-50 text-ink-500" aria-hidden="true">
          <Icon name={iconFor[icon]} size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip">{docType}</span>
            {jurisdiction ? <span className="chip">{jurisdiction}</span> : null}
            {source ? <span className="chip">{source}</span> : null}
            {typeof score === "number" ? (
              <span className="font-mono text-mono-sm text-ink-500">score {score.toFixed(2)}</span>
            ) : null}
          </div>
          <Link
            href={href}
            className="mt-2 block text-body-md font-semibold text-ink-900 hover:text-brand"
          >
            {title}
          </Link>
          {summary ? (
            <p className="mt-1 line-clamp-2 text-body-sm text-ink-500">{summary}</p>
          ) : null}
          {matchReason ? (
            <p className="mt-2 trigger-passage">{matchReason}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
