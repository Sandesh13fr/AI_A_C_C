import Link from "next/link";
import { Icon, type IconName } from "@/components/icon";
import { StatusBadge } from "@/components/domain/status-badge";
import { cn, formatRelativeTime, titleCase } from "@/lib/utils";

export interface DocumentRowData {
  id: string;
  title: string;
  filename: string;
  sourceType: string;
  jurisdiction: string;
  species: string;
  status: string;
  updatedAt: string;
}

interface DocumentRowProps {
  document: DocumentRowData;
  href: string;
  active?: boolean;
  onClick?: () => void;
  showStatus?: boolean;
}

const FILE_ICONS: Record<string, IconName> = {
  pdf: "FileText",
  docx: "FileText",
  doc: "FileText",
  txt: "FileText",
};

function pickFileIcon(filename: string): IconName {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return FILE_ICONS[ext] ?? "FileText";
}

export function DocumentRow({ document, href, active, onClick, showStatus = true }: DocumentRowProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn("document-row", active && "document-row--active")}
    >
      <Icon name={pickFileIcon(document.filename)} size={16} className="shrink-0 text-ink-400" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-body-md font-medium text-ink-900">{document.title}</p>
        <p className="mt-0.5 truncate text-body-sm text-ink-500">
          {document.sourceType} · {document.jurisdiction} · {document.species}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {showStatus ? <StatusBadge status={document.status} /> : null}
        <span className="hidden font-mono text-mono-sm text-ink-400 md:inline">
          {document.updatedAt ? formatRelativeTime(document.updatedAt) : titleCase("Unknown")}
        </span>
      </div>
    </Link>
  );
}
