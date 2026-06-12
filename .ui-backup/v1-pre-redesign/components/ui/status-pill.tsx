import { Badge } from "@/components/ui/badge";

interface StatusPillProps {
  status: string;
}

export function StatusPill({ status }: StatusPillProps) {
  const normalized = status.toLowerCase();
  const variant =
    normalized.includes("ready") || normalized.includes("completed") || normalized.includes("reviewed")
      ? "success"
      : normalized.includes("block") || normalized.includes("failed") || normalized.includes("dismiss")
        ? "danger"
        : normalized.includes("review") || normalized.includes("pending")
          ? "warning"
          : "outline";

  return <Badge variant={variant}>{status}</Badge>;
}
