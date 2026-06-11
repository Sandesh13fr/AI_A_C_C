import type { DocumentItem } from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { titleCase } from "@/lib/utils";

export function DocumentMetadataPanel({ document }: { document: DocumentItem }) {
  const metadata = document.metadata;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Metadata</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-4 text-body-sm">
          <div>
            <dt className="app-label">Status</dt>
            <dd className="mt-1 text-ink">{titleCase(document.status)}</dd>
          </div>
          <div>
            <dt className="app-label">Ingestion stage</dt>
            <dd className="mt-1 text-ink">{titleCase(document.ingestion_stage)}</dd>
          </div>
          <div>
            <dt className="app-label">Source</dt>
            <dd className="mt-1 text-ink">{document.source_label ?? "Workspace upload"}</dd>
          </div>
          <div>
            <dt className="app-label">Jurisdiction</dt>
            <dd className="mt-1 text-ink">{metadata?.jurisdiction_code ?? "Pending"}</dd>
          </div>
          <div>
            <dt className="app-label">Species</dt>
            <dd className="mt-1 text-ink">{metadata?.species?.join(", ") || "Not tagged"}</dd>
          </div>
          <div>
            <dt className="app-label">Welfare categories</dt>
            <dd className="mt-1 text-ink">{metadata?.welfare_categories?.map(titleCase).join(", ") || "Not tagged"}</dd>
          </div>
          <div>
            <dt className="app-label">Recorded date</dt>
            <dd className="mt-1 text-ink">Not supplied in current payload</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
