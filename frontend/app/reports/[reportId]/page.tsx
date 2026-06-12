import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/domain/status-badge";
import { GovernanceNote } from "@/components/domain/governance-note";
import { Icon } from "@/components/icon";
import { apiClient, type ExportListResponse, type FindingItem } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { formatDateLabel, formatRelativeTime, titleCase } from "@/lib/utils";

interface PageProps {
  params: Promise<{ reportId: string }>;
}

const EMPTY_EXPORTS: ExportListResponse = { items: [], total: 0 };
const EMPTY_FINDINGS: { items: FindingItem[]; total: number } = { items: [], total: 0 };

export default async function ReportDetailPage({ params }: PageProps) {
  const { reportId } = await params;
  const session = getSession();
  let report = null;
  let findings: FindingItem[] = [];
  try {
    const token = session?.accessToken ?? null;
    const response: ExportListResponse = token
      ? await apiClient.listExports(token)
      : EMPTY_EXPORTS;
    report = response.items.find((item) => item.id === reportId) ?? response.items[0] ?? null;
  } catch {
    report = null;
  }
  try {
    const token = session?.accessToken ?? null;
    const findingsResponse = token
      ? await apiClient.listFindings(token)
      : EMPTY_FINDINGS;
    findings = findingsResponse.items;
  } catch {
    findings = [];
  }

  if (!report) {
    notFound();
  }
  const isExportable = report.status === "exported" || report.status === "approved";

  return (
    <AppShell
      breadcrumbs={[{ label: "Reports", href: "/reports" }, { label: report.title ?? report.id }]}
      pageEyebrow="Report packet"
      pageTitle={report.title ?? report.id}
      pageDescription={`Report ID ${report.id}${report.jurisdiction ? ` · ${report.jurisdiction}` : ""}`}
      actions={
        <>
          {report.analysis_run_id ? (
            <Link href={`/analysis/${report.analysis_run_id}`}>
              <Button variant="ghost" leadingIcon={<Icon name="BarChart2" size={14} />}>
                View analysis run
              </Button>
            </Link>
          ) : null}
          <Button
            variant="primary"
            disabled={!isExportable}
            leadingIcon={<Icon name="Download" size={14} />}
          >
            {isExportable ? "Export" : "Export locked"}
          </Button>
        </>
      }
    >
      <div className="mt-6 surface p-5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={report.status} />
          {report.governance_state ? <StatusBadge status={report.governance_state} /> : null}
          {report.jurisdiction ? <span className="chip">{report.jurisdiction}</span> : null}
          {report.analysis_run_id ? (
            <span className="font-mono text-mono-sm text-ink-500">{report.analysis_run_id}</span>
          ) : null}
        </div>
        <p className="mt-2 text-body-sm text-ink-500">
          Report ID <span className="font-mono text-ink-700">{report.id}</span> ·{" "}
          {formatDateLabel(report.created_at ?? report.updated_at)}
        </p>
      </div>

      <section className="mt-6 space-y-3">
        <h2 className="section-heading">Executive summary</h2>
        <div className="surface p-5">
          <p className="font-display text-body-lg text-ink-900">
            {findings.length} candidate findings have been recorded for this run. All findings are
            decision-support output and require explicit reviewer sign-off before export.
          </p>
        </div>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="section-heading">Findings</h2>
        {findings.length === 0 ? (
          <div className="surface p-5 text-body-sm text-ink-500">
            No findings are linked to this report yet.
          </div>
        ) : (
          <ul className="space-y-3">
            {findings.map((finding) => (
              <li
                key={finding.id}
                className="rounded-sm border border-border-subtle p-3 text-body-sm"
              >
                <p className="text-ink-900">{finding.explanation ?? "Candidate concern"}</p>
                <p className="mt-1 font-mono text-mono-sm text-ink-500">
                  {titleCase(finding.finding_type)} · {finding.severity}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="section-heading">Audit trail</h2>
        <div className="surface p-5 text-body-sm text-ink-500">
          {report.created_at ? (
            <p>Report created · {formatRelativeTime(report.created_at)}</p>
          ) : (
            <p>Audit trail is not yet populated for this report.</p>
          )}
        </div>
      </section>

      <section className="mt-6">
        <GovernanceNote variant={isExportable ? "signed" : "draft"}>
          {isExportable
            ? "All findings are signed off. Export is unlocked in PDF, DOCX, and CSV formats."
            : "External exports remain blocked until every finding is signed off."}
        </GovernanceNote>
      </section>

      <section className="mt-6 surface p-5">
        <h2 className="section-heading">Export controls</h2>
        <p className="mt-1 text-body-sm text-ink-500">
          External exports remain blocked until all findings are signed off.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="secondary" disabled>
            PDF
          </Button>
          <Button variant="secondary" disabled>
            DOCX
          </Button>
          <Button variant="secondary" disabled>
            CSV
          </Button>
        </div>
        <p className="mt-3 text-body-sm text-ink-500">
          Available formats: <span className="font-mono text-ink-700">{titleCase(report.status)}</span>.
        </p>
      </section>
    </AppShell>
  );
}
