import type { IconName } from "@/components/icon";

/**
 * Static UI configuration. These are not data — they are navigation shortcuts,
 * label keys, and design-system constants. Values that should come from the
 * backend are fetched via the `apiClient` in each page.
 */

export interface QuickActionDef {
  label: string;
  description: string;
  href: string;
  icon: IconName;
}

export const quickActions: QuickActionDef[] = [
  {
    label: "Upload document",
    description: "Create a new ingest batch.",
    href: "/uploads",
    icon: "Upload",
  },
  {
    label: "Search corpus",
    description: "Run hybrid retrieval across documents and rules.",
    href: "/documents?tab=search",
    icon: "Search",
  },
  {
    label: "Start analysis",
    description: "Queue a document for decision-support review.",
    href: "/analysis/new",
    icon: "BarChart2",
  },
  {
    label: "Review findings",
    description: "Open the human sign-off queue.",
    href: "/review",
    icon: "CheckSquare",
  },
  {
    label: "Add rule",
    description: "Review imported or draft rule entries.",
    href: "/knowledge-base/import",
    icon: "Scale",
  },
  {
    label: "View reports",
    description: "Check internal and export-gated report packets.",
    href: "/reports",
    icon: "BookOpen",
  },
];

export interface DashboardStatDef {
  key: "indexed_documents" | "pending_review" | "active_analyses" | "knowledge_coverage";
  label: string;
  description: string;
  live: boolean;
  emphasis?: "neutral" | "warning";
}

export const dashboardStatDefs: DashboardStatDef[] = [
  {
    key: "indexed_documents",
    label: "Indexed Documents",
    description: "Across inspections, policies, contracts, and guidance.",
    live: true,
  },
  {
    key: "pending_review",
    label: "Pending Review",
    description: "Candidate concerns waiting on reviewer action.",
    live: true,
    emphasis: "warning",
  },
  {
    key: "active_analyses",
    label: "Active Analyses",
    description: "Queued or running decision-support jobs.",
    live: true,
  },
  {
    key: "knowledge_coverage",
    label: "Knowledge Coverage",
    description: "Mapped rule and precedent corpus coverage.",
    live: true,
  },
];

export interface SystemStatusDef {
  key: string;
  description: string;
  tone: "ok" | "info" | "warning" | "critical";
}

export const systemStatusDefs: SystemStatusDef[] = [
  { key: "API health", description: "Operational", tone: "ok" },
  { key: "Worker queue", description: "Low backlog", tone: "info" },
  { key: "Search index", description: "Fresh · —", tone: "ok" },
  { key: "Governance gate", description: "Reviewer sign-off enforced", tone: "ok" },
];

export const documentStatusLabels: Record<string, string> = {
  indexed: "Indexed",
  needs_review: "Needs Review",
  flagged: "Flagged",
  approved: "Approved",
  synced: "Synced",
  draft: "Draft",
  pending: "Pending",
  complete: "Complete",
  queued: "Queued",
  running: "Running",
  failed: "Failed",
  cancelled: "Cancelled",
  blocked: "Blocked",
  exported: "Exported",
  in_review: "In Review",
  reviewed: "Reviewed",
  ready: "Ready",
  archived: "Archived",
};

export const verificationStatusLabels: Record<string, string> = {
  verified: "Verified",
  needs_review: "Needs review",
  draft: "Draft",
  placeholder: "Placeholder",
  rejected: "Rejected",
  imported: "Imported",
};

export const riskSeverityLabels: Record<string, string> = {
  critical: "CRITICAL POTENTIAL RISK",
  high: "HIGH POTENTIAL RISK",
  medium: "MEDIUM POTENTIAL RISK",
  low: "LOW POTENTIAL RISK",
  info: "INFORMATIONAL NOTE",
};

export interface AdminStatDef {
  label: string;
  description: string;
}

export const adminStatDefs: AdminStatDef[] = [
  { label: "Users", description: "Members of your organisation and the roles they hold." },
  { label: "Data sources", description: "External feeds that the platform ingests from." },
  { label: "Audit events", description: "Retained sign-offs, exports, imports, and model invocations." },
];

export const authPagesCopy = {
  loginHighlights: [
    "Grounded search across documents, rules, and citations.",
    "Decision-support analysis with reviewer sign-off controls.",
    "Governed exports that stay blocked until human approval.",
  ],
};
