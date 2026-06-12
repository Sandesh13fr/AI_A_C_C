"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/domain/search-input";
import { Tabs } from "@/components/domain/tabs";
import { Icon } from "@/components/icon";
import { StatusBadge } from "@/components/domain/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { apiClient, type RuleListItem, type RuleListResponse } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { verificationStatusLabels } from "@/lib/ui-config";
import { formatDateLabel, titleCase } from "@/lib/utils";

export default function KnowledgeBasePage() {
  const [tab, setTab] = useState("rules");
  const [rules, setRules] = useState<RuleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const session = getSession();
    apiClient
      .listRules(
        {
          q: query || undefined,
          page_size: 50,
        },
        session?.accessToken,
      )
      .then((response: RuleListResponse) => setRules(response.items))
      .catch(() => setRules([]))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <AppShell
      pageEyebrow="Rule and precedent corpus"
      pageTitle="Knowledge Base"
      pageDescription="Imported rules, guidance, and precedent material that ground reviewer decisions. Verification status controls how findings cite them."
      actions={
        <>
          <Link href="/knowledge-base/import">
            <Button variant="secondary" leadingIcon={<Icon name="Upload" size={14} />}>
              Import rules
            </Button>
          </Link>
          <Link href="/knowledge-base/review">
            <Button variant="primary" leadingIcon={<Icon name="CheckSquare" size={14} />}>
              Review imports
            </Button>
          </Link>
        </>
      }
    >
      <div className="mt-6">
        <Tabs
          paramName="tab"
          items={[
            { label: "Rules", value: "rules", count: rules.length },
            { label: "Precedent", value: "precedent" },
            { label: "Guidance", value: "guidance" },
            { label: "Imports", value: "imports", href: "/knowledge-base/import" },
          ]}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <SearchInput
            placeholder="Search rules by citation, title, or summary…"
            value={query}
            onChange={setQuery}
          />
          <div className="surface">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Title / Citation</th>
                  <th scope="col">Jurisdiction</th>
                  <th scope="col">Type</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-right">
                    Date added
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <tr key={index}>
                      <td colSpan={5}>
                        <Skeleton className="h-10 w-full" />
                      </td>
                    </tr>
                  ))
                ) : rules.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState
                        title="No rules found"
                        description="Try adjusting your search or import new rules."
                      />
                    </td>
                  </tr>
                ) : (
                  rules.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <Link
                          href={`/knowledge-base/${row.id}`}
                          className="text-body-md font-semibold text-ink-900 hover:text-brand"
                        >
                          {row.title}
                        </Link>
                        <p className="mt-0.5 font-mono text-mono-sm text-ink-500">
                          {row.citation ?? row.citation_label ?? "—"} · {row.summary ?? "No summary available."}
                        </p>
                      </td>
                      <td>
                        <span className="chip">{row.jurisdiction_code}</span>
                      </td>
                      <td>
                        {row.welfare_category
                          ? titleCase(row.welfare_category.replace(/_/g, " "))
                          : row.source_type
                            ? titleCase(row.source_type.replace(/_/g, " "))
                            : "—"}
                      </td>
                      <td>
                        <StatusBadge status={row.verification_status} />
                        <span className="sr-only">
                          {verificationStatusLabels[row.verification_status] ?? titleCase(row.verification_status)}
                        </span>
                      </td>
                      <td className="text-right">
                        <span className="font-mono text-mono-sm text-ink-700">
                          {formatDateLabel(null)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="space-y-6">
          <div className="surface p-4">
            <p className="text-label uppercase text-ink-500">Verification states</p>
            <ul className="mt-3 space-y-2 text-body-sm text-ink-700">
              <li className="flex items-center gap-2">
                <StatusBadge status="verified" /> Ready for citation in findings.
              </li>
              <li className="flex items-center gap-2">
                <StatusBadge status="needs_review" /> Cited with a "needs verification" note.
              </li>
              <li className="flex items-center gap-2">
                <StatusBadge status="draft" /> Not cited in any finding yet.
              </li>
            </ul>
          </div>
          <div className="surface p-4">
            <p className="text-label uppercase text-ink-500">Recent activity</p>
            <p className="mt-3 text-body-sm text-ink-500">
              Activity is not available until a rule has been imported.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
