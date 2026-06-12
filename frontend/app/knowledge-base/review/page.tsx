"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/icon";
import { StatusBadge } from "@/components/domain/status-badge";

const IMPORT_ROWS = [
  { id: "imp-001", title: "Housing facilities — structural soundness", source: "APHIS 2024 update", jurisdiction: "US-FED", status: "needs_review" },
  { id: "imp-002", title: "Veterinary care — 24-hour availability", source: "APHIS 2024 update", jurisdiction: "US-FED", status: "needs_review" },
  { id: "imp-003", title: "Water access — continuous", source: "CA Prop 12 FAQ", jurisdiction: "US-CA", status: "draft" },
  { id: "imp-004", title: "Audit rights — written notice", source: "EU 1/2005", jurisdiction: "EU", status: "needs_review" },
];

export default function KnowledgeReviewPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <AppShell
      breadcrumbs={[
        { label: "Knowledge Base", href: "/knowledge-base" },
        { label: "Review imports" },
      ]}
      pageEyebrow="Imports review"
      pageTitle="Review imported rules"
      pageDescription="Approve or reject each imported rule. Only approved rules can be cited in findings."
      actions={
        <Button
          variant="primary"
          disabled={selected.size === 0}
          leadingIcon={<Icon name="Check" size={14} />}
        >
          Approve {selected.size} selected
        </Button>
      }
    >
      <div className="mt-6 surface">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col" className="w-10" />
              <th scope="col">Title</th>
              <th scope="col">Source</th>
              <th scope="col">Jurisdiction</th>
              <th scope="col">Status</th>
              <th scope="col" className="text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {IMPORT_ROWS.map((row) => (
              <tr key={row.id}>
                <td>
                  <Checkbox
                    checked={selected.has(row.id)}
                    onChange={() => toggle(row.id)}
                    aria-label={`Select ${row.title}`}
                  />
                </td>
                <td>
                  <p className="text-body-md font-medium text-ink-900">{row.title}</p>
                </td>
                <td className="text-body-sm text-ink-700">{row.source}</td>
                <td>
                  <span className="chip">{row.jurisdiction}</span>
                </td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
                <td className="text-right">
                  <div className="inline-flex items-center gap-2">
                    <Button size="sm" variant="secondary">
                      Approve
                    </Button>
                    <Button size="sm" variant="danger">
                      Reject
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
