import { Icon, type IconName } from "@/components/icon";
import { ConfidenceBadge } from "@/components/domain/confidence-badge";
import { RiskBadge } from "@/components/domain/risk-badge";
import { Button } from "@/components/ui/button";
import { cn, titleCase } from "@/lib/utils";
import type { Severity } from "@/lib/schemas";

export interface FindingCardFinding {
  id: string;
  finding_type?: string;
  welfare_category?: string | null;
  severity: Severity | string;
  calibrated_confidence?: number;
  trigger_kind?: "passage" | "absence" | "metadata" | "pattern";
  trigger_text?: string | null;
  page_start?: number | null;
  page_end?: number | null;
  explanation?: string;
  counterfactual?: string | null;
  status?: string;
  citations?: Array<{ id?: string; citation_label?: string; relevance_note?: string | null }>;
}

interface FindingCardProps {
  finding: FindingCardFinding;
  compact?: boolean;
  signedOffBy?: string | null;
  signedOffAt?: string | null;
  showActions?: boolean;
  onAccept?: () => void;
  onDismiss?: () => void;
  onFlag?: () => void;
  onComment?: () => void;
}

const severityClass: Record<string, string> = {
  critical: "finding-card finding-card--critical",
  high: "finding-card finding-card--high",
  medium: "finding-card finding-card--medium",
  low: "finding-card finding-card--low",
  info: "finding-card finding-card--info",
};

const triggerIconByKind: Record<string, IconName> = {
  passage: "FileText",
  absence: "AlertTriangle",
  metadata: "Info",
  pattern: "Diamond",
};

export function FindingCard({
  finding,
  compact,
  signedOffBy,
  signedOffAt,
  showActions = true,
  onAccept,
  onDismiss,
  onFlag,
  onComment,
}: FindingCardProps) {
  const triggerKind = (finding.trigger_kind ?? "passage") as keyof typeof triggerIconByKind;
  const triggerIcon = triggerIconByKind[triggerKind] ?? "FileText";
  const isSigned = Boolean(signedOffBy);
  const severity = String(finding.severity ?? "info") as keyof typeof severityClass;
  const findingType = String(finding.finding_type ?? "needs_human_review");
  const citations = finding.citations ?? [];

  return (
    <article
      className={cn(
        severityClass[severity],
        "finding-card--ai-draft",
        isSigned && "border-l-emerald-600",
        compact && "p-4",
      )}
      aria-label={`${titleCase(severity)} potential risk finding`}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <RiskBadge severity={severity} />
          <span className="status-badge status-badge--needs-review">
            {isSigned ? "Human reviewed" : "AI-assisted draft"}
          </span>
          <span className="status-badge status-badge--synced">
            {titleCase(findingType)}
          </span>
        </div>
        <ConfidenceBadge value={finding.calibrated_confidence ?? 0} />
      </header>

      <h3 className="mt-3 font-display text-display-lg leading-tight text-ink-900">
        {titleCase(findingType === "potential_risk" ? "Potential risk" : findingType.replace(/_/g, " "))}
        <span className="text-ink-400"> · </span>
        <span className="text-ink-700">{titleCase(finding.welfare_category ?? "general")}</span>
      </h3>

      {finding.trigger_text ? (
        <div className="mt-3">
          <p className="text-label uppercase text-ink-500">
            <Icon name={triggerIcon} size={11} className="-mt-0.5 mr-1 inline" />
            {finding.trigger_kind === "absence" ? "Missing protection" : "Trigger passage"}
          </p>
          <p className="trigger-passage mt-1.5">"{finding.trigger_text}"</p>
          {finding.page_start ? (
            <p className="mt-1 font-mono text-mono-sm text-ink-400">
              p. {finding.page_start}{finding.page_end && finding.page_end !== finding.page_start ? `–${finding.page_end}` : ""}
            </p>
          ) : null}
        </div>
      ) : null}

      {!compact && finding.explanation ? (
        <p className="mt-3 font-display text-body-md leading-relaxed text-ink-700">
          {finding.explanation}
        </p>
      ) : null}

      {citations.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-label uppercase text-ink-500">Cited standard</span>
          {citations.map((citation) => (
            <span
              key={citation.id ?? citation.citation_label ?? Math.random().toString()}
              className="chip chip--brand"
              title={citation.relevance_note ?? undefined}
            >
              {citation.citation_label}
            </span>
          ))}
        </div>
      ) : null}

      {finding.counterfactual && !compact ? (
        <p className="mt-3 border-l-2 border-border pl-3 text-body-sm italic text-ink-500">
          {finding.counterfactual}
        </p>
      ) : null}

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-body-sm text-ink-500">
          {isSigned && signedOffBy ? (
            <span>
              Reviewed by <span className="font-mono text-ink-700">{signedOffBy}</span>
              {signedOffAt ? <span className="ml-1 text-ink-400">· {signedOffAt}</span> : null}
            </span>
          ) : (
            <span>
              Jurisdiction: <span className="font-mono text-ink-700">US-FED</span> · Document date:{" "}
              <span className="font-mono text-ink-700">Not extracted</span>
            </span>
          )}
        </div>
        {showActions && !isSigned ? (
          <div className="flex flex-wrap items-center gap-2">
            {onComment ? (
              <Button size="sm" variant="ghost" onClick={onComment}>
                Comment
              </Button>
            ) : null}
            {onFlag ? (
              <Button size="sm" variant="secondary" onClick={onFlag}>
                Flag
              </Button>
            ) : null}
            {onDismiss ? (
              <Button size="sm" variant="danger" onClick={onDismiss}>
                Dismiss
              </Button>
            ) : null}
            {onAccept ? (
              <Button size="sm" variant="primary" onClick={onAccept}>
                Accept
              </Button>
            ) : null}
          </div>
        ) : null}
      </footer>
    </article>
  );
}
