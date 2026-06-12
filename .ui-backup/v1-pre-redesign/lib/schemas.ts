export type FindingType =
  | "potential_risk"
  | "possible_gap"
  | "weak_commitment"
  | "ambiguous_language"
  | "needs_human_review";

export type Severity = "low" | "medium" | "high" | "critical";

export type TriggerKind = "passage" | "absence" | "metadata" | "pattern";

export type FindingStatus =
  | "pending_review"
  | "accepted"
  | "edited"
  | "dismissed"
  | "signed_off";

export type AnalysisType =
  | "general_compliance"
  | "contract"
  | "gap"
  | "policy_comparison";

export type AnalysisStatus =
  | "queued"
  | "running"
  | "needs_review"
  | "reviewed"
  | "failed"
  | "cancelled";

export type CitationType = "rule" | "precedent" | "source_document";

export type ClauseType =
  | "welfare_commitment"
  | "audit_right"
  | "termination_for_cause"
  | "reporting_obligation"
  | "inspection_access"
  | "remediation"
  | "missing_expected_clause";

export type ReviewEventType =
  | "accept"
  | "dismiss"
  | "edit"
  | "comment"
  | "request_changes"
  | "sign_off"
  | "reopen";

export type TenantType = "client_org" | "partner_org" | "internal";

export interface PotentialRiskFlag {
  id: string;
  finding_type: FindingType;
  welfare_category: string;
  severity: Severity;
  calibrated_confidence: number;
  trigger_kind: TriggerKind;
  trigger_text: string | null;
  page_start: number | null;
  page_end: number | null;
  explanation: string;
  counterfactual: string | null;
  status: FindingStatus;
  citations: FlagCitation[];
}

export interface FlagCitation {
  id: string;
  citation_type: CitationType;
  citation_label: string;
  rule_version_id: string | null;
  source_chunk_id: string | null;
  quote: string | null;
  relevance_note: string;
}

export interface AnalysisRun {
  id: string;
  document_id: string;
  analysis_type: AnalysisType;
  status: AnalysisStatus;
  jurisdiction_code: string;
  summary: {
    total_potential_risks: number;
    high_severity: number;
    possible_gaps: number;
    requires_human_review: boolean;
  };
  findings: PotentialRiskFlag[];
  disclaimer: string;
}

export interface DocumentInfo {
  id: string;
  name: string;
  document_type: string;
  jurisdiction_code: string;
  document_date: string | null;
  status: string;
}
