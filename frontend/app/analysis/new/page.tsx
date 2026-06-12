"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Icon } from "@/components/icon";
import { UploadDropzone } from "@/components/domain/upload-dropzone";
import { Notice } from "@/components/ui/notice";
import { apiClient } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { cn } from "@/lib/utils";

type Step = "upload" | "configure" | "progress";

export default function NewAnalysisPage() {
  return (
    <Suspense fallback={<div className="p-8 text-body-sm text-ink-500">Loading wizard…</div>}>
      <NewAnalysisWizard />
    </Suspense>
  );
}

const STEPS: Array<{ key: Step; label: string; index: number }> = [
  { key: "upload", label: "Upload documents", index: 1 },
  { key: "configure", label: "Configure analysis", index: 2 },
  { key: "progress", label: "Run analysis", index: 3 },
];

function NewAnalysisWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetDocumentId = searchParams?.get("documentId") ?? "";
  const presetRulebookId = searchParams?.get("rulebookId") ?? "";

  const [step, setStep] = useState<Step>("upload");
  const [batchName, setBatchName] = useState("Untitled batch");
  const [files, setFiles] = useState<File[]>([]);
  const [rulebookId, setRulebookId] = useState(presetRulebookId || "rb-001");
  const [jurisdiction, setJurisdiction] = useState("US-FED");
  const [analysisType, setAnalysisType] = useState("standard");
  const [batchId, setBatchId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [progress, setProgress] = useState(0);

  function startBatch() {
    if (files.length === 0 && !presetDocumentId) {
      setError("Upload at least one document or start from an existing document.");
      return;
    }
    setError(null);
    setStep("configure");
  }

  async function startRun() {
    setStarting(true);
    setError(null);
    try {
      const session = getSession();
      const response = await apiClient.createUploadBatch(
        {
          batch_type: "user_upload",
          total_files: files.length || 1,
          name: batchName,
        },
        session?.accessToken,
      );
      const id = String(response.id ?? `batch-${Date.now()}`);
      setBatchId(id);
      const runResponse = await apiClient.createAnalysisRun(
        {
          document_id: presetDocumentId || `doc-${id}`,
          batch_id: id,
          analysis_type: analysisType === "gap" ? "gap" : "general_compliance",
          jurisdiction_code: jurisdiction,
          rulebook_id: rulebookId,
        },
        session?.accessToken,
      );
      setStep("progress");
      const runId = String(runResponse.id);
      const interval = setInterval(() => {
        setProgress((value) => {
          if (value >= 100) {
            clearInterval(interval);
            router.push(`/analysis/${runId}`);
            return 100;
          }
          return value + 12;
        });
      }, 350);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to start analysis";
      setError(message);
    } finally {
      setStarting(false);
    }
  }

  return (
    <AppShell
      breadcrumbs={[{ label: "Analysis", href: "/analysis/new" }, { label: "New run" }]}
      pageEyebrow="Decision-support pipeline"
      pageTitle="New analysis"
      pageDescription="Upload documents, choose a rulebook, and queue a decision-support run. Findings remain reviewer aids until a human signs off."
    >
      <Stepper currentStep={step} />
      <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          {step === "upload" ? (
            <div className="surface p-5">
              <h2 className="section-heading">Upload documents</h2>
              <p className="mt-1 text-body-sm text-ink-500">
                Drag in your PDFs, DOCX, or TXT exports. Each upload becomes part of an ingest batch.
              </p>
              <div className="mt-4 space-y-4">
                <UploadDropzone onFilesSelected={setFiles} />
                <div>
                  <label className="form-label" htmlFor="batch-name">
                    Batch name
                  </label>
                  <Input
                    id="batch-name"
                    value={batchName}
                    onChange={(event) => setBatchName(event.target.value)}
                    placeholder="Q2 supplier review"
                  />
                </div>
                {presetDocumentId ? (
                  <Notice title="Document pre-selected">
                    Starting from an existing document: <span className="font-mono">{presetDocumentId}</span>.
                  </Notice>
                ) : null}
                {error ? <Notice title="Upload error" tone="danger">{error}</Notice> : null}
              </div>
              <div className="mt-6 flex items-center justify-end gap-3">
                <Button variant="secondary" onClick={() => router.push("/dashboard")}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={startBatch}
                  trailingIcon={<Icon name="ChevronRight" size={14} />}
                >
                  Continue
                </Button>
              </div>
            </div>
          ) : null}

          {step === "configure" ? (
            <div className="surface p-5">
              <h2 className="section-heading">Configure analysis</h2>
              <p className="mt-1 text-body-sm text-ink-500">
                Choose the rulebook, jurisdiction, and analysis type. You can refine the document list on the
                next step.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="form-label" htmlFor="rulebook">
                    Rulebook
                  </label>
                  <Select
                    id="rulebook"
                    value={rulebookId}
                    onChange={(event) => setRulebookId(event.target.value)}
                  >
                    <option value="rb-001">Federal AWA baseline · v12</option>
                    <option value="rb-002">Poultry advocacy overlay · v4</option>
                    <option value="rb-003">EU transport & slaughter · v3</option>
                    <option value="rb-004">RSPCA assured guidance · v2</option>
                  </Select>
                </div>
                <div>
                  <label className="form-label" htmlFor="jurisdiction">
                    Jurisdiction
                  </label>
                  <Select
                    id="jurisdiction"
                    value={jurisdiction}
                    onChange={(event) => setJurisdiction(event.target.value)}
                  >
                    <option value="US-FED">US Federal</option>
                    <option value="US-CA">California</option>
                    <option value="EU">European Union</option>
                    <option value="MULTI">Multi-jurisdiction</option>
                  </Select>
                </div>
                <div>
                  <label className="form-label" htmlFor="analysis-type">
                    Analysis type
                  </label>
                  <Select
                    id="analysis-type"
                    value={analysisType}
                    onChange={(event) => setAnalysisType(event.target.value)}
                  >
                    <option value="standard">Standard decision-support</option>
                    <option value="gap">Gap audit</option>
                    <option value="contract">Contract clause review</option>
                  </Select>
                </div>
                <div>
                  <label className="form-label" htmlFor="documents-count">
                    Documents
                  </label>
                  <Input
                    id="documents-count"
                    value={`${files.length || 1} files in batch`}
                    readOnly
                  />
                </div>
              </div>
              {error ? (
                <div className="mt-4">
                  <Notice title="Run error" tone="danger">
                    {error}
                  </Notice>
                </div>
              ) : null}
              <div className="mt-6 flex items-center justify-between">
                <Button
                  variant="secondary"
                  onClick={() => setStep("upload")}
                  leadingIcon={<Icon name="ChevronLeft" size={14} />}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={startRun}
                  loading={starting}
                  trailingIcon={<Icon name="ChevronRight" size={14} />}
                >
                  {starting ? "Starting" : "Start analysis"}
                </Button>
              </div>
            </div>
          ) : null}

          {step === "progress" ? (
            <div className="surface p-5">
              <h2 className="section-heading">Analysis in progress</h2>
              <p className="mt-1 text-body-sm text-ink-500">
                The decision-support run is queued. You can watch the progress here or come back when it
                completes.
              </p>
              <div className="mt-5">
                <div className="h-2 rounded-full bg-ink-100">
                  <div
                    className="h-2 rounded-full bg-brand transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 font-mono text-mono-sm text-ink-500">{progress}%</p>
              </div>
              {batchId ? (
                <p className="mt-3 text-body-sm text-ink-500">
                  Batch <span className="font-mono text-ink-700">{batchId}</span> queued.
                </p>
              ) : null}
              <pre className="trigger-passage mt-4 max-h-48 overflow-auto text-mono-sm">
                {`[09:14:02] Ingest batch accepted.\n[09:14:03] Routing to model queue.\n[09:14:08] Chunking 12 documents (avg 1.4k tokens).\n[09:14:11] Rulebook rb-001 indexed (148 rules).\n[09:14:18] Retrieving precedent links…\n[09:14:24] Generating candidate findings (high → low severity).`}
              </pre>
              <div className="mt-5 flex items-center justify-end gap-3">
                <Button variant="ghost">Cancel run</Button>
                <Button variant="primary" onClick={() => router.push("/dashboard")}>
                  Open dashboard
                </Button>
              </div>
            </div>
          ) : null}
        </div>
        <div className="space-y-6">
          <div className="surface p-4">
            <p className="text-label uppercase text-ink-500">What this run does</p>
            <ul className="mt-3 space-y-2 text-body-sm text-ink-700">
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="mt-0.5 text-brand" />
                Indexes chunks against the selected rulebook and precedent corpus.
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="mt-0.5 text-brand" />
                Generates candidate findings with calibrated confidence.
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="mt-0.5 text-brand" />
                Routes findings to the Review Queue for human sign-off.
              </li>
            </ul>
          </div>
          <Notice title="Decision-support only" tone="warning">
            Findings produced by this run are decision-support output. They must be reviewed and signed
            off before they can appear in any export.
          </Notice>
        </div>
      </div>
    </AppShell>
  );
}

function Stepper({ currentStep }: { currentStep: Step }) {
  return (
    <ol className="flex flex-wrap items-center gap-3 text-body-sm" aria-label="Analysis steps">
      {STEPS.map((step, index) => {
        const isCurrent = step.key === currentStep;
        const isComplete = STEPS.findIndex((s) => s.key === currentStep) > index;
        return (
          <li
            key={step.key}
            className={cn(
              "flex items-center gap-2 rounded-sm border px-3 py-1.5",
              isCurrent
                ? "border-brand bg-brand-light text-brand"
                : isComplete
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-border text-ink-500",
            )}
            aria-current={isCurrent ? "step" : undefined}
          >
            <span className="font-mono text-mono-sm">{step.index}</span>
            <span>{step.label}</span>
            {isComplete ? <Icon name="Check" size={12} /> : null}
          </li>
        );
      })}
    </ol>
  );
}
