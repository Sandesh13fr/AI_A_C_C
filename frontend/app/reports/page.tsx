"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { StatusBadge } from "@/components/domain/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient, type ExportItem, type ExportListResponse } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { formatDateLabel } from "@/lib/utils";

export default function ReportsPage() {
  const [exports, setExports] = useState<ExportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    apiClient
      .listExports(session?.accessToken)
      .then((response: ExportListResponse) => setExports(response.items))
      .catch(() => setExports([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell
      pageEyebrow="Export-gated compliance reporting"
      pageTitle="Reports"
      pageDescription="Reviewed, signed-off report packets. External exports stay blocked until all findings are reviewed."
      actions={
        <Link href="/analysis/new">
          <Button variant="secondary" leadingIcon={<Icon name="BarChart2" size={14} />}>
            New analysis
          </Button>
        </Link>
      }
    >
      <div className="mt-6">
        {loading ? (
          <div className="surface">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Report title</th>
                  <th scope="col">Source document</th>
                  <th scope="col">Run ID</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-right">
                    Date
                  </th>
                  <th scope="col" className="text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 3 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={6}>
                      <Skeleton className="h-10 w-full" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : exports.length === 0 ? (
          <EmptyState
            title="No report packets yet"
            description="Reviewed report packets will appear here. Generate a report from a signed-off analysis run."
            action={
              <Link href="/analysis/new">
                <Button variant="primary" leadingIcon={<Icon name="BarChart2" size={14} />}>
                  Start analysis
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="surface">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Report title</th>
                  <th scope="col">Source document</th>
                  <th scope="col">Run ID</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-right">
                    Date
                  </th>
                  <th scope="col" className="text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {exports.map((report) => (
                  <tr key={report.id}>
                    <td>
                      <Link
                        href={`/reports/${report.id}`}
                        className="text-body-md font-semibold text-ink-900 hover:text-brand"
                      >
                        {report.title ?? report.id}
                      </Link>
                      {report.jurisdiction ? (
                        <p className="mt-0.5 text-body-sm text-ink-500">{report.jurisdiction}</p>
                      ) : null}
                    </td>
                    <td className="text-body-sm text-ink-700">
                      {report.document_title ?? report.document_id ?? "—"}
                    </td>
                    <td>
                      <span className="font-mono text-mono-sm text-ink-700">
                        {report.analysis_run_id ?? "—"}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={report.status} />
                    </td>
                    <td className="text-right">
                      <span className="font-mono text-mono-sm text-ink-700">
                        {formatDateLabel(report.created_at ?? report.updated_at)}
                      </span>
                    </td>
                    <td className="text-right">
                      <Link
                        href={`/reports/${report.id}`}
                        className="text-label uppercase text-brand hover:underline"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
