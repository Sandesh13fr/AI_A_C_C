import { cn } from "@/lib/utils";
import { documentStatusLabels } from "@/lib/ui-config";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const styleByStatus: Record<string, string> = {
  indexed: "status-badge status-badge--indexed",
  needs_review: "status-badge status-badge--needs-review",
  flagged: "status-badge status-badge--flagged",
  approved: "status-badge status-badge--approved",
  synced: "status-badge status-badge--synced",
  draft: "status-badge status-badge--draft",
  pending: "status-badge status-badge--pending",
  complete: "status-badge status-badge--approved",
  reviewed: "status-badge status-badge--approved",
  ready: "status-badge status-badge--approved",
  rejected: "status-badge status-badge--flagged",
  imported: "status-badge status-badge--needs-review",
  in_review: "status-badge status-badge--needs-review",
  running: "status-badge status-badge--synced",
  queued: "status-badge status-badge--synced",
  failed: "status-badge status-badge--flagged",
  cancelled: "status-badge status-badge--flagged",
  blocked: "status-badge status-badge--flagged",
  exported: "status-badge status-badge--synced",
  archived: "status-badge status-badge--synced",
  placeholder: "status-badge status-badge--synced",
  verified: "status-badge status-badge--approved",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = status.toLowerCase();
  const tone = styleByStatus[key] ?? "status-badge status-badge--synced";
  const label = documentStatusLabels[key] ?? prettifyStatus(key);
  return <span className={cn(tone, className)}>{label}</span>;
}

function prettifyStatus(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
