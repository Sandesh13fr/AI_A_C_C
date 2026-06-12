import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { titleCase } from "@/lib/utils";
import type { DocumentItem } from "@/lib/api-client";

interface DocumentMetadataPanelProps {
  document: Pick<DocumentItem, "status" | "ingestion_stage" | "source_label" | "metadata">;
}

export function DocumentMetadataPanel({ document: doc }: DocumentMetadataPanelProps) {
  const metadata = doc.metadata;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chain of custody</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Row label="Status" value={titleCase(doc.status)} />
        <Row label="Ingestion stage" value={titleCase(doc.ingestion_stage)} />
        <Row label="Source" value={doc.source_label ?? "Workspace upload"} />
        <Row label="Jurisdiction" value={metadata?.jurisdiction_code ?? "Pending"} mono />
        <Row label="Facility" value={metadata?.facility_name ?? "Not tagged"} />
        <Row label="Species" value={metadata?.species?.join(", ") || "Not tagged"} />
        <Row
          label="Welfare categories"
          value={metadata?.welfare_categories?.map(titleCase).join(", ") || "Not tagged"}
        />
        <Row label="Document date" value="Not extracted" mono />
      </CardContent>
    </Card>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-label uppercase text-ink-500">{label}</p>
      <p className={mono ? "mt-1 font-mono text-body-sm text-ink-900" : "mt-1 text-body-sm text-ink-900"}>
        {value}
      </p>
    </div>
  );
}
