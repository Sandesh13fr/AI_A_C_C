import { Badge } from "@/components/ui/badge";

interface CitationChipProps {
  label: string;
  type?: "rule" | "precedent" | "source";
}

export function CitationChip({ label, type = "source" }: CitationChipProps) {
  const variant = type === "rule" ? "accent" : type === "precedent" ? "warning" : "outline";
  return <Badge variant={variant}>{label}</Badge>;
}
