import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell title="Document Detail" subtitle="Document-scoped evidence, page text, citations, and grounded chat context.">
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <Card>
          <div className="aspect-[8.5/11] rounded-card border border-dark-border bg-dark-surface p-5">
            <p className="font-mono text-micro text-mid-grey">Document ID</p>
            <p className="mt-1 break-all text-body-sm">{id}</p>
            <div className="mt-6 border-t border-dark-border pt-5">
              <h2 className="text-h3 text-balance">Viewer</h2>
              <p className="mt-2 text-body-sm text-mid-grey text-pretty">
                PDF rendering uses the restored viewer component once signed file URLs are configured.
              </p>
            </div>
          </div>
        </Card>
        <div className="space-y-4">
          <Card>
            <h2 className="text-h3 text-balance">Metadata</h2>
            <dl className="mt-4 space-y-3 text-body-sm">
              <div>
                <dt className="text-mid-grey">Jurisdiction</dt>
                <dd>US-FED</dd>
              </div>
              <div>
                <dt className="text-mid-grey">Citation Mode</dt>
                <dd>Source chunks required</dd>
              </div>
            </dl>
          </Card>
          <Card>
            <h2 className="text-h3 text-balance">Grounded Chat</h2>
            <a
              className="mt-4 inline-flex rounded-button bg-teal px-4 py-2 text-body-sm font-semibold text-white"
              href={`/chat?document=${id}`}
            >
              Open document chat
            </a>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
