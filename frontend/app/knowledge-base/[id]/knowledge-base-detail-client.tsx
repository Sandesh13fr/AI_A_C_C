"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/domain/status-badge";
import { Icon } from "@/components/icon";
import { Notice } from "@/components/ui/notice";
import { apiClient, type RuleDetailResponse } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { formatDateLabel, titleCase } from "@/lib/utils";

export function KnowledgeBaseDetailClient({ id }: { id: string }) {
  const [rule, setRule] = useState<RuleDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = getSession();
    apiClient
      .getRule(id, session?.accessToken)
      .then(setRule)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Rule detail is unavailable");
        setRule(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <AppShell
      breadcrumbs={[
        { label: "Knowledge Base", href: "/knowledge-base" },
        { label: rule?.title ?? "Rule" },
      ]}
      pageEyebrow="Rule detail"
      pageTitle={rule?.title ?? "Rule"}
      pageDescription="Source, version, applicability, and precedent links for this rule."
    >
      {loading ? (
        <div className="surface p-5">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="mt-3 h-40 w-full" />
        </div>
      ) : error || !rule ? (
        <div className="surface p-5 text-body-sm text-ink-500">
          {error ?? "Rule detail is unavailable."}
        </div>
      ) : (
        <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="surface p-5">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={rule.verification_status} />
                <span className="chip">{rule.jurisdiction_code}</span>
                {rule.source_type ? (
                  <span className="chip">{titleCase(rule.source_type)}</span>
                ) : null}
              </div>
              <h2 className="mt-3 font-display text-display-lg text-ink-900">{rule.title}</h2>
              <p className="mt-1 text-body-sm text-ink-500">
                Citation: <span className="font-mono text-ink-700">{rule.citation ?? "—"}</span>
              </p>
              {rule.summary ? (
                <p className="mt-3 text-body-md text-ink-700">{rule.summary}</p>
              ) : null}
            </div>
            {rule.latest_version ? (
              <div className="surface p-5">
                <h3 className="section-heading">Rule text</h3>
                <p className="trigger-passage mt-3 whitespace-pre-wrap">
                  {rule.latest_version.rule_text}
                </p>
                {rule.latest_version.interpretation_notes ? (
                  <div className="mt-4">
                    <h4 className="text-label uppercase text-ink-500">Interpretation notes</h4>
                    <p className="mt-1 text-body-sm text-ink-700">
                      {rule.latest_version.interpretation_notes}
                    </p>
                  </div>
                ) : null}
                {rule.latest_version.source_url ? (
                  <div className="mt-4">
                    <a
                      href={rule.latest_version.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand hover:underline"
                    >
                      View source
                    </a>
                  </div>
                ) : null}
              </div>
            ) : null}
            <Notice title="Decision-support notice" tone="warning">
              This rule is presented as a reviewer aid, not a legal conclusion. Verify all citations
              against official sources before relying on them in any export.
            </Notice>
          </div>
          <div className="space-y-6">
            <div className="surface p-4">
              <p className="text-label uppercase text-ink-500">Applicability</p>
              {rule.applicability.length > 0 ? (
                <ul className="mt-3 space-y-3 text-body-sm text-ink-700">
                  {rule.applicability.map((item) => (
                    <li key={item.id} className="space-y-1">
                      {item.species.length > 0 ? (
                        <p>
                          <span className="text-label uppercase text-ink-500">Species</span>
                          <span className="ml-2">{item.species.join(", ")}</span>
                        </p>
                      ) : null}
                      {item.facility_types.length > 0 ? (
                        <p>
                          <span className="text-label uppercase text-ink-500">Facility</span>
                          <span className="ml-2">{item.facility_types.join(", ")}</span>
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-body-sm text-ink-500">No applicability metadata yet.</p>
              )}
            </div>
            <div className="surface p-4">
              <p className="text-label uppercase text-ink-500">Linked analysis runs</p>
              <p className="mt-3 text-body-sm text-ink-500">No analysis runs have been linked yet.</p>
            </div>
            <div className="surface p-4">
              <p className="text-label uppercase text-ink-500">Linked precedent</p>
              {rule.precedent_links.length > 0 ? (
                <ul className="mt-3 space-y-3 text-body-sm text-ink-700">
                  {rule.precedent_links.map((link) => (
                    <li key={link.id} className="rounded-sm border border-border-subtle p-3">
                      <p className="text-ink-900">{link.linked_document_title ?? "Related document"}</p>
                      <p className="mt-1 font-mono text-mono-sm text-ink-500">
                        {link.relationship_type.replace(/_/g, " ")}
                        {link.confidence ? ` · ${Math.round(link.confidence * 100)}%` : ""}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-body-sm text-ink-500">No precedent links yet.</p>
              )}
            </div>
            <div className="surface p-4 text-body-sm text-ink-500">
              <p>
                Last updated{" "}
                <span className="font-mono text-ink-700">{formatDateLabel(rule.updated_at)}</span>
              </p>
              <p>
                Welfare category:{" "}
                <span className="text-ink-700">{titleCase(rule.welfare_category ?? "General")}</span>
              </p>
            </div>
            <Button variant="primary" leadingIcon={<Icon name="BarChart2" size={14} />}>
              Run analysis with this rulebook
            </Button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
