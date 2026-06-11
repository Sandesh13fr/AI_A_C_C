"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DocumentMetadataPanel } from "@/components/domain/document-metadata-panel";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Notice } from "@/components/ui/notice";
import { apiClient, type DocumentItem, type RelatedRuleLink } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { titleCase } from "@/lib/utils";

export function DocumentDetailClient({ id }: { id: string }) {
  const [document, setDocument] = useState<DocumentItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    apiClient
      .getDocument(id, session?.accessToken)
      .then(setDocument)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Unable to load the document"))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <AppShell
      title="Document Detail"
      subtitle="Document-scoped evidence, source passages, metadata, and chat handoff for grounded reviewer work."
      actions={
        <Link href={`/chat?document=${id}`}>
          <Button>Open document chat</Button>
        </Link>
      }
    >
      {loading ? (
        <Card>
          <CardContent className="space-y-3">
            <div className="h-6 w-48 rounded-button bg-app-subtle" />
            <div className="h-48 rounded-card bg-app-subtle" />
          </CardContent>
        </Card>
      ) : error || !document ? (
        <EmptyState title="Document detail is unavailable" description={error ?? "No document record was returned for this route."} />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{document.title ?? document.filename}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Notice title="Viewer status">
                  PDF rendering is preserved as a non-breaking placeholder until signed file URLs and viewer assets are configured.
                </Notice>
                <div className="rounded-card border border-app-line bg-app-bg p-5">
                  <p className="app-label">Source text preview</p>
                  <p className="mt-3 text-body-sm text-ink-soft">
                    {document.raw_text?.slice(0, 1400) ?? "Raw text is not currently available for this document. Once extraction output is present, this panel can render grounded passages and chunk navigation."}
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-card border border-app-line bg-app-subtle p-4">
                    <p className="app-label">Analysis status</p>
                    <p className="mt-2 text-body-sm text-ink">{titleCase(document.status)}</p>
                  </div>
                  <div className="rounded-card border border-app-line bg-app-subtle p-4">
                    <p className="app-label">Related findings</p>
                    <p className="mt-2 text-body-sm text-ink-soft">Open the analysis route for candidate concerns and human review notes.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <DocumentMetadataPanel document={document} />
            <RelatedRulesSection documentId={id} />
            <Card>
              <CardHeader>
                <CardTitle>Related evidence surfaces</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-body-sm text-ink-soft">
                <p>Source passages and chunk navigation will attach here when extraction payloads are available.</p>
                <p>Related rules and precedent remain clearly labeled as reviewer aids, not legal conclusions.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function RelatedRulesSection({ documentId }: { documentId: string }) {
  const [rules, setRules] = useState<RelatedRuleLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    apiClient
      .getDocumentRelatedRules(documentId, session?.accessToken)
      .then((res) => setRules(res.items))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [documentId]);

  if (loading) return null;
  if (rules.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Rules ({rules.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rules.map((link) => (
          <div key={link.link_id} className="rounded-card border border-app-line bg-app-subtle p-3">
            <Link href={`/knowledge-base/${link.rule_id}`} className="text-app-teal-deep text-body-sm hover:underline">
              {link.title}
            </Link>
            <p className="mt-1 text-micro text-ink-soft">
              {link.citation_label} · {link.relationship_type.replace(/_/g, " ")}
              {link.confidence ? ` · ${Math.round(link.confidence * 100)}%` : ""}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
