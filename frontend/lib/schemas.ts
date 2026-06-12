export type Severity = "low" | "medium" | "high" | "critical" | "info";

export type TriggerKind = "passage" | "absence" | "metadata" | "pattern";

export type FindingType =
  | "potential_risk"
  | "possible_gap"
  | "weak_commitment"
  | "ambiguous_language"
  | "needs_human_review";
