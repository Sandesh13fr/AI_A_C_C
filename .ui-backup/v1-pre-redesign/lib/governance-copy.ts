export const FORBIDDEN_FINDING_TERMS = [
  "violation",
  "illegal",
  "guilty",
  "liable",
  "enforcement action recommended",
  "definitive noncompliance",
] as const;

export const ALLOWED_FINDING_TYPES = [
  "potential_risk",
  "possible_gap",
  "weak_commitment",
  "ambiguous_language",
  "needs_human_review",
] as const;

export const EXPORT_DISCLAIMER =
  "This report is a decision-support output. It surfaces potential animal-welfare " +
  "concerns, possible gaps, and research-relevant observations for human review. " +
  "It is not legal advice, not a legal determination, not an enforcement " +
  "recommendation, and not an exhaustive compliance assessment.";

export const CONFIDENCE_DISCLAIMER =
  "Calibrated confidence estimates how likely this finding is to be useful " +
  "for human review. It is not a legal certainty.";

export function validateFindingText(text: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  for (const term of FORBIDDEN_FINDING_TERMS) {
    if (text.toLowerCase().includes(term.toLowerCase())) {
      issues.push(`Contains forbidden term: "${term}"`);
    }
  }
  return { valid: issues.length === 0, issues };
}
