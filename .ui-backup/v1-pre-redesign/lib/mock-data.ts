import type { PotentialRiskFlag, Severity } from "@/lib/schemas";

export const dashboardStats = [
  { label: "Indexed documents", value: "847", detail: "Across inspections, policies, contracts, and guidance." },
  { label: "Pending review", value: "12", detail: "Candidate concerns waiting on reviewer action." },
  { label: "Active analyses", value: "5", detail: "Queued or running decision-support jobs." },
  { label: "Knowledge coverage", value: "94%", detail: "Mapped rule and precedent corpus coverage." },
];

export const quickActions = [
  { label: "Upload document", href: "/uploads", note: "Create a new ingest batch." },
  { label: "Search corpus", href: "/search", note: "Run hybrid retrieval across documents and rules." },
  { label: "Start analysis", href: "/analysis", note: "Queue a document for decision-support review." },
  { label: "Review findings", href: "/review", note: "Open the human sign-off queue." },
  { label: "Add rule", href: "/knowledge-base", note: "Review imported or draft rule entries." },
  { label: "View reports", href: "/reports", note: "Check internal and export-gated report packets." },
];

export const recentActivity = [
  { title: "USDA_APHIS_2024_Q1_Report.pdf", meta: "Inspection report · Federal · Broiler chicken", status: "Indexed" },
  { title: "Supplier_Welfare_Amendment.docx", meta: "Contract · California · Layer chicken", status: "Needs review" },
  { title: "9_CFR_Title_9_Update.txt", meta: "Regulation · Federal · Multi-species", status: "Synced" },
];

export const sampleFindings: PotentialRiskFlag[] = [
  {
    id: "finding-001",
    finding_type: "potential_risk",
    welfare_category: "housing_environment",
    severity: "high",
    calibrated_confidence: 0.87,
    trigger_kind: "passage",
    trigger_text: "No square-footage or stocking-density benchmark is described for indoor holding areas.",
    page_start: 4,
    page_end: 5,
    explanation: "The document describes housing practice but does not ground the commitment in measurable space conditions, so reviewer follow-up is warranted.",
    counterfactual: "A clear density table or species-specific housing limit would reduce this concern.",
    status: "pending_review",
    citations: [
      {
        id: "citation-001",
        citation_type: "rule",
        citation_label: "9 CFR 3.1(a)",
        rule_version_id: "rule-001",
        source_chunk_id: null,
        quote: "Housing facilities shall be structurally sound and maintained in good repair.",
        relevance_note: "Baseline rule commonly consulted when housing obligations are vague.",
      },
    ],
  },
  {
    id: "finding-002",
    finding_type: "possible_gap",
    welfare_category: "veterinary_care",
    severity: "medium",
    calibrated_confidence: 0.72,
    trigger_kind: "absence",
    trigger_text: "No mortality review cadence or veterinarian escalation timing is documented.",
    page_start: null,
    page_end: null,
    explanation: "The policy references animal health monitoring but does not specify the review process for adverse events.",
    counterfactual: "A documented escalation ladder and reporting deadline would narrow the gap.",
    status: "pending_review",
    citations: [
      {
        id: "citation-002",
        citation_type: "precedent",
        citation_label: "APHIS review memo 2023-17",
        rule_version_id: null,
        source_chunk_id: null,
        quote: null,
        relevance_note: "Comparable review material focused on response timing and oversight documentation.",
      },
    ],
  },
];

export const reviewQueue = [
  { id: "RQ-109", title: "Housing metric omission", owner: "A. Rivera", status: "Awaiting review", reason: "Needs human review" },
  { id: "RQ-114", title: "Contract audit-right ambiguity", owner: "Unassigned", status: "Ready", reason: "Weak commitment" },
  { id: "RQ-121", title: "Veterinary escalation timing", owner: "J. Boyd", status: "Commented", reason: "Possible gap" },
];

export const knowledgeBaseEntries = [
  { citation: "9 CFR 3.1(a)", jurisdiction: "Federal", category: "Housing", type: "Regulation", effective: "2024-01-01", status: "Verified" },
  { citation: "CA Proposition 12", jurisdiction: "California", category: "Confinement", type: "Statute", effective: "2024-01-01", status: "Reviewed" },
  { citation: "RSPCA Assured housing note", jurisdiction: "UK", category: "Environmental enrichment", type: "Guidance", effective: "2023-11-14", status: "Draft import" },
];

export const rulebookRows = [
  { name: "Federal AWA baseline", version: "v12", visibility: "Org-wide", rules: 148, status: "Published" },
  { name: "Poultry advocacy overlay", version: "v4", visibility: "Internal", rules: 63, status: "Draft" },
];

export const reportRows = [
  { name: "Q2 reviewed findings packet", type: "Internal packet", status: "Ready", signoff: "Completed", date: "2026-06-07" },
  { name: "Partner share - Midwest facilities", type: "Partner share", status: "Blocked", signoff: "Pending", date: "2026-06-05" },
];

export const contractClauses = [
  { clause: "Welfare commitments", score: "Strong", note: "Measurable language present, but no remedial timing." },
  { clause: "Audit rights", score: "Moderate", note: "Access rights exist but notice requirements are restrictive." },
  { clause: "Reporting obligations", score: "Weak", note: "Event reporting trigger is vague and not time-bounded." },
  { clause: "Termination for cause", score: "Moderate", note: "Termination exists but evidentiary threshold is undefined." },
];

export const gapChecklist = [
  { label: "Space or stocking-density benchmark", state: "Possible gap" },
  { label: "Veterinary escalation timing", state: "Possible gap" },
  { label: "Audit and remediation loop", state: "Present with review note" },
  { label: "Mortality reporting obligation", state: "Needs citation review" },
];

export const adminRows = [
  { label: "Users", value: "28 active members", detail: "Role assignments across 4 organizations." },
  { label: "Data sources", value: "11 tracked feeds", detail: "Federal, state, NGO, and precedent sources." },
  { label: "Audit events", value: "3,984 retained", detail: "Sign-offs, exports, imports, and model invocations." },
];

export const systemStatus = [
  { label: "API health", value: "Operational" },
  { label: "Worker queue", value: "Low backlog" },
  { label: "Search index", value: "Fresh as of 09:40 UTC" },
  { label: "Governance gate", value: "Reviewer sign-off enforced" },
];

export const severityTone: Record<Severity, { surface: string; text: string }> = {
  low: { surface: "bg-risk-low", text: "text-ink" },
  medium: { surface: "bg-risk-medium", text: "text-ink" },
  high: { surface: "bg-risk-high", text: "text-ink" },
  critical: { surface: "bg-risk-critical", text: "text-ink" },
};
