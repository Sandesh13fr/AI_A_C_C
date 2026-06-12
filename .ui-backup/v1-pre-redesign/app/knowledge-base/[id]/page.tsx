"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Notice } from "@/components/ui/notice";
import { apiClient, type RuleDetailResponse } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { titleCase } from "@/lib/utils";

export default function RuleDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [rule, setRule] = useState<RuleDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = getSession();
    apiClient
      .getRule(id, session?.accessToken)
      .then(setRule)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Unable to load rule"))
      .finally(() => setLoading(false));
  }, [id]);

  const statusVariant = (status: string) => {
    if (status === "verified") return "success";
    if (status === "needs_review") return "warning";
    if (status === "draft" || status === "placeholder") return "outline";
    return "default";
  };

  return (
    <AppShell
      title={rule?.title ?? "Rule Detail"}
      subtitle="Regulatory rule details with version history, applicability, and precedent links."
    >
      {loading ? (
        <Card>
          <CardContent className="space-y-3">
            <div className="h-6 w-48 rounded-button bg-app-subtle" />
            <div className="h-48 rounded-card bg-app-subtle" />
          </CardContent>
        </Card>
      ) : error || !rule ? (
        <EmptyState title="Rule detail is unavailable" description={error ?? "No rule record was found."} />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CardTitle>{rule.title}</CardTitle>
                  <Badge variant={statusVariant(rule.verification_status)}>
                    {rule.verification_status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-card border border-app-line bg-app-subtle p-4">
                    <p className="app-label">Citation</p>
                    <p className="mt-2 text-body-sm text-ink">{rule.citation ?? rule.citation_label ?? "Citation unavailable"}</p>
                  </div>
                  <div className="rounded-card border border-app-line bg-app-subtle p-4">
                    <p className="app-label">Jurisdiction</p>
                    <p className="mt-2 text-body-sm text-ink">{rule.jurisdiction_code}</p>
                  </div>
                  <div className="rounded-card border border-app-line bg-app-subtle p-4">
                    <p className="app-label">Category</p>
                    <p className="mt-2 text-body-sm text-ink">
                      {rule.welfare_category ? titleCase(rule.welfare_category.replace(/_/g, " ")) : "Unknown"}
                    </p>
                  </div>
                  <div className="rounded-card border border-app-line bg-app-subtle p-4">
                    <p className="app-label">Agency / Source</p>
                    <p className="mt-2 text-body-sm text-ink">
                      {rule.agency_name ?? (rule.source_code ? titleCase(rule.source_code.replace(/_/g, " ")) : "Not provided")}
                    </p>
                  </div>
                </div>

                {rule.summary && (
                  <div className="rounded-card border border-app-line bg-app-subtle p-4">
                    <p className="app-label">Summary</p>
                    <p className="mt-2 text-body-sm text-ink-soft">{rule.summary}</p>
                  </div>
                )}

                {rule.latest_version && (
                  <>
                    <div className="rounded-card border border-app-line bg-app-bg p-5">
                      <p className="app-label">Rule text</p>
                      <p className="mt-3 whitespace-pre-wrap text-body-sm text-ink">
                        {rule.latest_version.rule_text}
                      </p>
                    </div>

                    {rule.latest_version.interpretation_notes && (
                      <div className="rounded-card border border-app-line bg-app-subtle p-4">
                        <p className="app-label">Interpretation notes</p>
                        <p className="mt-2 text-body-sm text-ink-soft">{rule.latest_version.interpretation_notes}</p>
                      </div>
                    )}

                    {rule.latest_version.source_url && (
                      <Notice title="Source">
                        <a
                          href={rule.latest_version.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-app-teal-deep underline"
                        >
                          {rule.latest_version.source_url}
                        </a>
                      </Notice>
                    )}
                  </>
                )}

                <Notice title="Decision-support notice">
                  This rule is presented as a reviewer aid, not a legal conclusion. Verify all citations against
                  official sources before use.
                </Notice>
              </CardContent>
            </Card>

            {rule.chunks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Rule chunks ({rule.chunks.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {rule.chunks.map((chunk) => (
                    <div key={chunk.id} className="rounded-card border border-app-line bg-app-subtle p-4">
                      <p className="font-mono text-micro uppercase text-ink-soft">Chunk {chunk.chunk_index}</p>
                      <p className="mt-2 text-body-sm text-ink">{chunk.chunk_text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {rule.applicability.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Applicability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {rule.applicability.map((item) => (
                    <div key={item.id} className="space-y-2">
                      {item.species.length > 0 && (
                        <div>
                          <p className="app-label">Species</p>
                          <p className="text-body-sm text-ink">{item.species.join(", ")}</p>
                        </div>
                      )}
                      {item.facility_types.length > 0 && (
                        <div>
                          <p className="app-label">Facility types</p>
                          <p className="text-body-sm text-ink">{item.facility_types.join(", ")}</p>
                        </div>
                      )}
                      {item.industries.length > 0 && (
                        <div>
                          <p className="app-label">Industries</p>
                          <p className="text-body-sm text-ink">{item.industries.join(", ")}</p>
                        </div>
                      )}
                      {item.applicability_notes && (
                        <div>
                          <p className="app-label">Notes</p>
                          <p className="text-body-sm text-ink-soft">{item.applicability_notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {rule.precedent_links.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Related documents ({rule.precedent_links.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {rule.precedent_links.map((link) => (
                    <div key={link.id} className="rounded-card border border-app-line bg-app-subtle p-3">
                      {link.document_id ? (
                        <Link href={`/documents/${link.document_id}`} className="text-app-teal-deep text-body-sm hover:underline">
                          {link.linked_document_title ?? `Document ${link.document_id.slice(0, 8)}`}
                        </Link>
                      ) : (
                        <p className="text-body-sm text-ink">{link.linked_document_title ?? "Related document"}</p>
                      )}
                      <p className="mt-1 text-micro text-ink-soft">
                        {link.relationship_type.replace(/_/g, " ")}
                        {link.confidence ? ` · ${Math.round(link.confidence * 100)}% confidence` : ""}
                      </p>
                      {link.note && <p className="mt-1 text-micro text-ink-soft">{link.note}</p>}
                      {link.linked_chunk?.chunk_text && (
                        <p className="mt-2 text-micro text-ink-soft">{link.linked_chunk.chunk_text}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
