const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type LoginResponse = {
  access_token: string;
  token_type: "bearer";
  user: {
    id: string;
    email: string;
    full_name: string | null;
    global_role: string;
    organization_id: string | null;
    org_role: string | null;
  };
};

export type DocumentMetadata = {
  issuer: string | null;
  jurisdiction_code: string | null;
  facility_name: string | null;
  facility_id?: string | null;
  species: string[];
  inspection_date?: string | null;
  document_date?: string | null;
  inspector_name?: string | null;
  reference_number?: string | null;
  welfare_categories: string[];
  facility_types: string[];
  industries: string[];
  extra?: Record<string, unknown>;
};

export type DocumentChunk = {
  id: string;
  chunk_index: number;
  raw_text?: string | null;
  retrieval_summary?: string | null;
  text?: string | null;
};

export type DocumentItem = {
  id: string;
  organization_id: string | null;
  title: string | null;
  filename: string;
  original_name: string | null;
  file_path?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
  doc_type: string;
  source_label: string | null;
  status: string;
  ingestion_stage: string;
  retrieval_summary: string | null;
  raw_text?: string | null;
  metadata: DocumentMetadata | null;
  chunks?: DocumentChunk[];
  topics?: string[];
  related_rules?: RelatedRuleLink[];
  created_at?: string | null;
  updated_at?: string | null;
};

export type DocumentListResponse = {
  items: DocumentItem[];
  total: number;
  page: number;
  page_size: number;
};

export type ScoreBreakdown = {
  vector_score: number;
  bm25_score: number;
  metadata_boost: number;
  final_score: number;
};

export type SearchRequest = {
  query?: string;
  top_k?: number;
  doc_type?: string;
  jurisdiction?: string;
  species?: string[];
  welfare_category?: string[];
  industry?: string[];
  facility_type?: string[];
  source?: string;
  organization_id?: string;
};

export type SearchResult = {
  id: string;
  title: string | null;
  filename: string;
  doc_type: string;
  source_label: string | null;
  retrieval_summary: string | null;
  metadata: DocumentMetadata | null;
  scores: ScoreBreakdown;
  match_reason: string | null;
};

export type SearchResponse = {
  query: string;
  total_results: number;
  results: SearchResult[];
};

export type AnalysisRunResponse = {
  id: string;
  document_id: string;
  analysis_type: string;
  jurisdiction_code: string;
  status: string;
  summary: Record<string, unknown>;
  disclaimer: string;
  findings?: FindingItem[];
};

export type FindingItem = {
  id: string;
  analysis_run_id?: string;
  finding_type: string;
  welfare_category?: string | null;
  severity: "low" | "medium" | "high" | "critical" | "info";
  calibrated_confidence?: number;
  trigger_kind?: "passage" | "absence" | "metadata" | "pattern";
  trigger_text?: string | null;
  page_start?: number | null;
  page_end?: number | null;
  explanation?: string;
  counterfactual?: string | null;
  status?: string;
  document_id?: string | null;
  flag_id?: string | null;
  citations?: Array<Record<string, unknown>>;
};

export type FindingsListResponse = {
  items: FindingItem[];
  total: number;
  allowed_finding_types?: string[];
};

export type ReviewQueueItem = {
  id: string;
  flag_id?: string;
  title?: string;
  finding_id?: string;
  document_id?: string;
  document_title?: string;
  analysis_run_id?: string;
  severity?: FindingItem["severity"];
  submitted_at?: string;
  assigned_to?: string;
  status?: "pending" | "in_review" | "complete" | "commented";
  reason?: string;
};

export type ReviewQueueResponse = {
  items: ReviewQueueItem[];
  total: number;
  status?: string;
  message?: string;
};

export type RuleListItem = {
  id: string;
  rule_code: string;
  title: string;
  citation: string | null;
  jurisdiction_code: string;
  agency_name: string | null;
  source_code: string | null;
  welfare_category: string | null;
  verification_status: string;
  latest_version_preview: string | null;
  version_label: string | null;
  summary: string | null;
  chunk_count: number;
  precedent_link_count: number;
  canonical_id: string | null;
  citation_label: string | null;
  source_type: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type RuleListResponse = {
  items: RuleListItem[];
  total: number;
  page: number;
  page_size: number;
};

export type RuleVersionDetail = {
  id: string;
  version_label: string | null;
  effective_start: string | null;
  effective_end: string | null;
  rule_text: string;
  standard_text: string | null;
  interpretation_notes: string | null;
  plain_language_summary: string | null;
  source_url: string | null;
  verification_status: string;
  metadata: Record<string, unknown>;
};

export type RuleApplicabilityDetail = {
  id: string;
  species: string[];
  facility_types: string[];
  industries: string[];
  document_types: string[];
  jurisdiction_code?: string | null;
  activity_type?: string | null;
  applicability_notes?: string | null;
};

export type RuleChunkDetail = {
  id: string;
  chunk_index: number;
  chunk_text: string;
  text: string | null;
  token_estimate?: number | null;
};

export type RulePrecedentLinkDetail = {
  id: string;
  document_id: string | null;
  document_chunk_id: string | null;
  chunk_id: string | null;
  relationship_type: string;
  note: string | null;
  notes: string | null;
  confidence: number | null;
  linked_document_title?: string | null;
  linked_document_type?: string | null;
  linked_chunk?: {
    id?: string | null;
    document_id?: string | null;
    document_title?: string | null;
    chunk_text?: string | null;
    chunk_index?: number | null;
  } | null;
};

export type RuleDetailResponse = {
  id: string;
  rule_code: string;
  title: string;
  citation: string | null;
  jurisdiction_code: string;
  agency_name: string | null;
  source_code: string | null;
  welfare_category: string | null;
  verification_status: string;
  summary: string | null;
  is_active: boolean;
  canonical_id: string | null;
  citation_label: string | null;
  source_type: string | null;
  created_at: string | null;
  updated_at: string | null;
  latest_version: RuleVersionDetail | null;
  applicability: RuleApplicabilityDetail[];
  chunks: RuleChunkDetail[];
  precedent_links: RulePrecedentLinkDetail[];
};

export type RelatedRuleLink = {
  link_id: string;
  rule_id: string;
  rule_code: string;
  canonical_id: string | null;
  citation: string | null;
  citation_label: string | null;
  title: string;
  jurisdiction_code: string;
  welfare_category: string;
  relationship_type: string;
  note: string | null;
  notes: string | null;
  confidence: number | null;
  verification_status: string;
};

export type DocumentRelatedRulesResponse = {
  items: RelatedRuleLink[];
  total: number;
};

export type SearchGroupedResponse = {
  query: string;
  documents: Record<string, unknown>[];
  chunks: Record<string, unknown>[];
  rules: RuleListItem[];
  total_documents: number;
  total_chunks: number;
  total_rules: number;
};

export type ChatAnswerResponse = {
  answer: string;
  citations: Array<Record<string, unknown>>;
  guardrails: string[];
};

export type IngestBatchResponse = {
  id: string;
  status: string;
  batch_type: string;
  total_files: number;
  next_step: string;
};

export type RulebookListItem = {
  id: string;
  name: string;
  rulebook_type?: string | null;
  status?: string | null;
  version?: string | null;
  jurisdiction?: string | null;
  rule_count?: number;
  description?: string | null;
  updated_at?: string | null;
};

export type RulebookListResponse = {
  items: RulebookListItem[];
  total: number;
};

export type ExportItem = {
  id: string;
  analysis_run_id?: string | null;
  document_id?: string | null;
  document_title?: string | null;
  title?: string | null;
  status: string;
  jurisdiction?: string | null;
  governance_state?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  export_type?: string;
};

export type ExportListResponse = {
  items: ExportItem[];
  total: number;
  disclaimer_text?: string;
};

export type WatchlistItem = {
  id: string;
  name: string;
  item_count?: number;
  description?: string | null;
  last_updated?: string | null;
};

export type WatchlistListResponse = {
  items: WatchlistItem[];
  total: number;
  status?: string;
};

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  token?: string | null;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { detail?: string; error?: { message?: string } } | null;
    throw new ApiError(response.status, payload?.detail ?? payload?.error?.message ?? response.statusText);
  }

  return (await response.json()) as T;
}

export const apiClient = {
  login: (email: string, password: string) =>
    request<LoginResponse>("/auth/login", { method: "POST", body: { email, password } }),
  register: (body: { email: string; password: string; full_name?: string; organization_name?: string }) =>
    request<LoginResponse>("/auth/register", { method: "POST", body }),
  me: (token?: string | null) => request<LoginResponse["user"]>("/users/me", { token }),
  listDocuments: (params?: { q?: string; status?: string; doc_type?: string; page?: number; page_size?: number; organization_id?: string }, token?: string | null) => {
    const search = new URLSearchParams();
    if (params?.q) search.set("q", params.q);
    if (params?.status) search.set("status", params.status);
    if (params?.doc_type) search.set("doc_type", params.doc_type);
    if (params?.page) search.set("page", String(params.page));
    if (params?.page_size) search.set("page_size", String(params.page_size));
    if (params?.organization_id) search.set("organization_id", params.organization_id);
    const qs = search.toString();
    return request<DocumentListResponse>(`/documents${qs ? `?${qs}` : ""}`, { token });
  },
  getDocument: (id: string, token?: string | null) => request<DocumentItem>(`/documents/${id}`, { token }),
  search: (body: SearchRequest, token?: string | null) => request<SearchResponse>("/search", { method: "POST", body, token }),
  createUploadBatch: (body: Record<string, unknown>, token?: string | null) =>
    request<IngestBatchResponse>("/uploads", { method: "POST", body, token }),
  createAnalysisRun: (body: Record<string, unknown>, token?: string | null) =>
    request<AnalysisRunResponse>("/analysis-runs", { method: "POST", body, token }),
  getAnalysisRun: (id: string, token?: string | null) =>
    request<AnalysisRunResponse>(`/analysis-runs/${id}`, { token }),
  listRules: (
    params?: { q?: string; jurisdiction?: string; category?: string; verification_status?: string; page?: number; page_size?: number },
    token?: string | null,
  ) => {
    const search = new URLSearchParams();
    if (params?.q) search.set("q", params.q);
    if (params?.jurisdiction) search.set("jurisdiction", params.jurisdiction);
    if (params?.category) search.set("category", params.category);
    if (params?.verification_status) search.set("verification_status", params.verification_status);
    if (params?.page) search.set("page", String(params.page));
    if (params?.page_size) search.set("page_size", String(params.page_size));
    const qs = search.toString();
    return request<RuleListResponse>(`/rules${qs ? `?${qs}` : ""}`, { token });
  },
  searchRules: (q: string, limit?: number, token?: string | null) => {
    const search = new URLSearchParams({ q });
    if (limit) search.set("limit", String(limit));
    return request<{ items: RuleListItem[]; total: number }>(`/rules/search?${search.toString()}`, { token });
  },
  getRule: (id: string, token?: string | null) => request<RuleDetailResponse>(`/rules/${id}`, { token }),
  getDocumentRelatedRules: (documentId: string, token?: string | null) =>
    request<DocumentRelatedRulesResponse>(`/documents/${documentId}/related-rules`, { token }),
  globalSearch: (q: string, limit?: number, token?: string | null) => {
    const search = new URLSearchParams({ q });
    if (limit) search.set("limit", String(limit));
    return request<SearchGroupedResponse>(`/search?${search.toString()}`, { token });
  },
  listRulebooks: (token?: string | null) => request<RulebookListResponse>("/rulebooks", { token }),
  reviewQueue: (token?: string | null) => request<ReviewQueueResponse>("/review/queue", { token }),
  listFindings: (token?: string | null) => request<FindingsListResponse>("/findings", { token }),
  listExports: (token?: string | null) => request<ExportListResponse>("/exports", { token }),
  listWatchlists: (token?: string | null) => request<WatchlistListResponse>("/watchlists", { token }),
  askDocument: (documentId: string, content: string, token?: string | null) =>
    request<ChatAnswerResponse>(`/chat/document/${documentId}`, { method: "POST", body: { content }, token }),
};
