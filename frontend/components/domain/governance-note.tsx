import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

interface GovernanceNoteProps {
  title?: string;
  children: React.ReactNode;
  variant?: "draft" | "signed";
  className?: string;
}

export function GovernanceNote({
  title = "AI-assisted draft · Human review pending",
  children,
  variant = "draft",
  className,
}: GovernanceNoteProps) {
  return (
    <aside
      className={cn(
        "governance-note",
        variant === "signed" && "governance-note--signed",
        className,
      )}
      role="status"
    >
      <div className="flex items-start gap-2">
        <Icon
          name={variant === "signed" ? "Check" : "AlertTriangle"}
          size={14}
          className={cn("mt-0.5 shrink-0", variant === "signed" ? "text-emerald-700" : "text-accent-gold")}
        />
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-label uppercase",
              variant === "signed" ? "text-emerald-700" : "text-accent-gold",
            )}
          >
            {title}
          </p>
          <div className="mt-1 text-body-sm text-ink-700">{children}</div>
        </div>
      </div>
    </aside>
  );
}
