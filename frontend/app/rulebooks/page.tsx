"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/domain/status-badge";
import { Icon } from "@/components/icon";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient, type RulebookListItem, type RulebookListResponse } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { formatDateLabel } from "@/lib/utils";

export default function RulebooksPage() {
  const [rulebooks, setRulebooks] = useState<RulebookListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    apiClient
      .listRulebooks(session?.accessToken)
      .then((response: RulebookListResponse) => setRulebooks(response.items))
      .catch(() => setRulebooks([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell
      pageEyebrow="Regulatory standards"
      pageTitle="Rulebooks"
      pageDescription="Versioned regulatory standards and overlays. Edit and test them without changing review guardrails."
      actions={
        <Link href="/rulebooks/new">
          <Button variant="primary" leadingIcon={<Icon name="Plus" size={14} />}>
            New rulebook
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
                  <th scope="col">Name</th>
                  <th scope="col">Type</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 3 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={3}>
                      <Skeleton className="h-10 w-full" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : rulebooks.length === 0 ? (
          <EmptyState
            title="No rulebooks yet"
            description="Rulebooks you import or author will appear here."
            action={
              <Link href="/rulebooks/new">
                <Button variant="primary" leadingIcon={<Icon name="Plus" size={14} />}>
                  New rulebook
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="surface">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Type</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-right">
                    Updated
                  </th>
                  <th scope="col" className="text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rulebooks.map((rulebook) => (
                  <tr key={rulebook.id}>
                    <td>
                      <Link
                        href={`/rulebooks/${rulebook.id}`}
                        className="text-body-md font-semibold text-ink-900 hover:text-brand"
                      >
                        {rulebook.name}
                      </Link>
                      {rulebook.description ? (
                        <p className="mt-0.5 text-body-sm text-ink-500">{rulebook.description}</p>
                      ) : null}
                    </td>
                    <td>
                      <span className="chip">{rulebook.rulebook_type ?? "Standard"}</span>
                    </td>
                    <td>
                      <StatusBadge status={rulebook.status ?? "draft"} />
                    </td>
                    <td className="text-right">
                      <span className="font-mono text-mono-sm text-ink-700">
                        {formatDateLabel(rulebook.updated_at)}
                      </span>
                    </td>
                    <td className="text-right">
                      <Link
                        href={`/rulebooks/${rulebook.id}`}
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
