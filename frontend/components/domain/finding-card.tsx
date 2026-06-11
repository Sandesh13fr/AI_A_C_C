import { CitationChip } from "@/components/domain/citation-chip";
import { Card, CardContent } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { StatusPill } from "@/components/ui/status-pill";
import type { PotentialRiskFlag } from "@/lib/schemas";
import { formatPercentage, titleCase } from "@/lib/utils";

export function FindingCard({ finding }: { finding: PotentialRiskFlag }) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <RiskBadge severity={finding.severity} />
              <StatusPill status={titleCase(finding.status)} />
            </div>
            <h3 className="text-h3 text-ink">{titleCase(finding.finding_type)}</h3>
            <p className="text-body-sm text-ink-soft">{finding.explanation}</p>
          </div>
          <div className="rounded-card border border-app-line bg-app-subtle px-3 py-2 font-mono text-micro uppercase text-ink-soft">
            Confidence {formatPercentage(finding.calibrated_confidence)}
          </div>
        </div>

        {finding.trigger_text ? (
          <div className="rounded-card border border-app-line bg-app-bg px-4 py-3">
            <p className="app-label">Trigger passage</p>
            <p className="mt-2 text-body-sm text-ink">"{finding.trigger_text}"</p>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <CitationChip label={titleCase(finding.welfare_category)} />
          <CitationChip label={titleCase(finding.trigger_kind)} type="source" />
          {finding.citations.map((citation) => (
            <CitationChip
              key={citation.id}
              label={citation.citation_label}
              type={citation.citation_type === "rule" ? "rule" : citation.citation_type === "precedent" ? "precedent" : "source"}
            />
          ))}
        </div>

        {finding.counterfactual ? (
          <div className="border-t border-app-line pt-4">
            <p className="app-label">Reviewer counterfactual</p>
            <p className="mt-2 text-body-sm text-ink-soft">{finding.counterfactual}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
