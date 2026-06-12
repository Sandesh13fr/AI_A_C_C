import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/domain/status-badge";
import { Tabs } from "@/components/domain/tabs";
import { Icon } from "@/components/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient, type RulebookListResponse } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { formatDateLabel, titleCase } from "@/lib/utils";

interface PageProps {
  params: Promise<{ rulebookId: string }>;
}

const EMPTY_RULEBOOKS: RulebookListResponse = { items: [], total: 0 };

export default async function RulebookDetailPage({ params }: PageProps) {
  const { rulebookId } = await params;
  const session = getSession();
  let rulebook = null;
  try {
    const token = session?.accessToken ?? null;
    const response: RulebookListResponse = token
      ? await apiClient.listRulebooks(token)
      : EMPTY_RULEBOOKS;
    rulebook = response.items.find((item) => item.id === rulebookId) ?? response.items[0] ?? null;
  } catch {
    rulebook = null;
  }

  return (
    <AppShell
      breadcrumbs={[
        { label: "Rulebooks", href: "/rulebooks" },
        { label: rulebook?.name ?? rulebookId },
      ]}
      pageEyebrow="Rulebook"
      pageTitle={rulebook?.name ?? "Rulebook"}
      pageDescription={rulebook?.description ?? "Versioned rulebook detail."}
      actions={
        <>
          <Link href={`/rulebooks/${rulebookId}/edit`}>
            <Button variant="secondary" leadingIcon={<Icon name="Settings" size={14} />}>
              Edit
            </Button>
          </Link>
          <Link href={`/rulebooks/${rulebookId}/test`}>
            <Button variant="primary" leadingIcon={<Icon name="BarChart2" size={14} />}>
              Test against documents
            </Button>
          </Link>
        </>
      }
    >
      <div className="mt-6">
        <Tabs
          paramName="tab"
          items={[
            { label: "Overview", value: "overview" },
            { label: "Rules", value: "rules" },
            { label: "Test", value: "test", href: `/rulebooks/${rulebookId}/test` },
            { label: "Versions", value: "versions" },
          ]}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="surface p-5">
            <h2 className="section-heading">Rulebook metadata</h2>
            {rulebook ? (
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Name" value={rulebook.name} />
                <Field label="Type" value={rulebook.rulebook_type ?? "Standard"} />
                <Field label="Status" value={<StatusBadge status={rulebook.status ?? "draft"} />} />
                <Field label="Updated" value={formatDateLabel(rulebook.updated_at)} mono />
              </dl>
            ) : (
              <Skeleton className="mt-4 h-20 w-full" />
            )}
          </div>

          <div className="surface">
            <header className="border-b border-border px-4 py-3">
              <h2 className="font-display text-display-lg text-ink-900">Rules</h2>
              <p className="mt-1 text-body-sm text-ink-500">
                Open the Rules tab in the Knowledge Base to view rules linked to this rulebook.
              </p>
            </header>
            <div className="p-5 text-body-sm text-ink-500">
              The rule editor and version diff live in the Knowledge Base.
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface p-4">
            <p className="text-label uppercase text-ink-500">Linked analysis runs</p>
            <p className="mt-3 text-body-sm text-ink-500">No analysis runs have been linked yet.</p>
          </div>
          <div className="surface p-4">
            <p className="text-label uppercase text-ink-500">Version</p>
            <p className="mt-3 text-body-sm text-ink-500">
              {rulebook ? titleCase(rulebook.version ?? "v1") : "—"}
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div>
      <dt className="text-label uppercase text-ink-500">{label}</dt>
      <dd
        className={
          mono
            ? "mt-1 font-mono text-body-sm text-ink-900"
            : "mt-1 text-body-sm text-ink-900"
        }
      >
        {value}
      </dd>
    </div>
  );
}
