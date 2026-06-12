"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Icon } from "@/components/icon";
import { Notice } from "@/components/ui/notice";

export default function KnowledgeImportPage() {
  const [stage, setStage] = useState<"upload" | "preview">("upload");
  const [source, setSource] = useState("file");
  const [name, setName] = useState("");

  return (
    <AppShell
      breadcrumbs={[
        { label: "Knowledge Base", href: "/knowledge-base" },
        { label: "Import rules" },
      ]}
      pageEyebrow="Import"
      pageTitle="Import rules"
      pageDescription="Upload a source (PDF, URL, or API) and parse a preview before committing the import."
    >
      <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          {stage === "upload" ? (
            <div className="surface p-5">
              <h2 className="section-heading">1. Source</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="form-label" htmlFor="import-source">
                    Source type
                  </label>
                  <Select id="import-source" value={source} onChange={(event) => setSource(event.target.value)}>
                    <option value="file">PDF or DOCX file</option>
                    <option value="url">Public URL</option>
                    <option value="api">API endpoint</option>
                  </Select>
                </div>
                <div>
                  <label className="form-label" htmlFor="import-name">
                    Name this import
                  </label>
                  <Input
                    id="import-name"
                    placeholder="e.g. APHIS 2024 inspection update"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
                {source === "file" ? (
                  <div className="rounded-md border border-dashed border-border-strong px-6 py-8 text-center">
                    <p className="text-body-sm text-ink-500">Drop the source file here, or browse to upload.</p>
                  </div>
                ) : (
                  <div>
                    <label className="form-label" htmlFor="import-url">
                      URL
                    </label>
                    <Input id="import-url" placeholder="https://…" />
                  </div>
                )}
              </div>
              <div className="mt-6 flex items-center justify-end gap-3">
                <Button variant="secondary">Cancel</Button>
                <Button
                  variant="primary"
                  onClick={() => setStage("preview")}
                  trailingIcon={<Icon name="ChevronRight" size={14} />}
                >
                  Parse preview
                </Button>
              </div>
            </div>
          ) : (
            <div className="surface p-5">
              <h2 className="section-heading">2. Preview</h2>
              <p className="mt-1 text-body-sm text-ink-500">
                We detected 14 candidate rules. Approve to push them to the imports review queue.
              </p>
              <ul className="mt-4 space-y-2">
                {[
                  "Housing facilities — structural soundness",
                  "Veterinary care — 24-hour availability",
                  "Water access — continuous",
                  "Audit rights — written notice",
                ].map((title) => (
                  <li
                    key={title}
                    className="flex items-center justify-between gap-3 rounded-sm border border-border-subtle p-3 text-body-sm"
                  >
                    <span className="text-ink-900">{title}</span>
                    <span className="font-mono text-mono-sm text-ink-500">needs review</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center justify-between">
                <Button variant="secondary" onClick={() => setStage("upload")} leadingIcon={<Icon name="ChevronLeft" size={14} />}>
                  Back
                </Button>
                <Button variant="primary" leadingIcon={<Icon name="Check" size={14} />}>
                  Send to imports review
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-6">
          <Notice title="What happens next" tone="info">
            Imported rules go to the imports review queue. Each rule is approved individually before it can
            be cited in findings.
          </Notice>
        </div>
      </div>
    </AppShell>
  );
}
