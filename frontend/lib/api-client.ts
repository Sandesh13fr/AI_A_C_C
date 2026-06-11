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
  species: string[];
  welfare_categories: string[];
  facility_types: string[];
  industries: string[];
};

export type DocumentItem = {
  id: string;
  organization_id: string | null;
  title: string | null;
  filename: string;
  original_name: string | null;
  doc_type: string;
  source_label: string | null;
  status: string;
  ingestion_stage: string;
  retrieval_summary: string | null;
  raw_text?: string | null;
  metadata: DocumentMetadata | null;
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
};

export type RuleListItem = {
  id: string;
  canonical_id: string;
  citation_label: string;
  title: string;
  jurisdiction_code: string;
  source_type: string;
  welfare_category: string;
  verification_status: string;
  version_label: string | null;
  summary: string | null;
  chunk_count: number;
  precedent_link_count: number;
};

export type RuleListResponse = {
  items: RuleListItem[];
  total: number;
  page: number;
  page_size: number;
};

export type RuleVersionDetail = {
  id: string;
  version_label: string;
  effective_start: string;
  effective_end: string | null;
  standard_text: string;
  plain_language_summary: string | null;
  source_url: string | null;
  verification_status: string;
};

export type RuleApplicabilityDetail = {
  id: string;
  species: string[];
  facility_types: string[];
  industries: string[];
  document_types: string[];
};

export type RuleChunkDetail = {
  id: string;
  chunk_index: number;
  text: string;
};

export type RulePrecedentLinkDetail = {
  id: string;
  document_id: string;
  chunk_id: string | null;
  relationship_type: string;
  notes: string | null;
  confidence: number | null;
};

export type RuleDetailResponse = {
  id: string;
  canonical_id: string;
  citation_label: string;
  title: string;
  jurisdiction_code: string;
  source_type: string;
  welfare_category: string;
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
  canonical_id: string;
  citation_label: string;
  title: string;
  jurisdiction_code: string;
  welfare_category: string;
  relationship_type: string;
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
  me: (token?: string | null) => request<LoginResponse["user"]>("/users/me", { token }),
  listDocuments: (token?: string | null) => request<DocumentListResponse>("/documents", { token }),
  getDocument: (id: string, token?: string | null) => request<DocumentItem>(`/documents/${id}`, { token }),
  search: (body: SearchRequest, token?: string | null) => request<SearchResponse>("/search", { method: "POST", body, token }),
  createUploadBatch: (body: Record<string, unknown>, token?: string | null) =>
    request<Record<string, unknown>>("/uploads", { method: "POST", body, token }),
  createAnalysisRun: (body: Record<string, unknown>, token?: string | null) =>
    request<AnalysisRunResponse>("/analysis-runs", { method: "POST", body, token }),
  getAnalysisRun: (id: string, token?: string | null) => request<AnalysisRunResponse>(`/analysis-runs/${id}`, { token }),
  listRules: (params?: { q?: string; jurisdiction?: string; category?: string; verification_status?: string; page?: number; page_size?: number }, token?: string | null) => {
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
  getRule: (id: string, token?: string | null) => request<RuleDetailResponse>(`/rules/${id}`, { token }),
  getDocumentRelatedRules: (documentId: string, token?: string | null) =>
    request<DocumentRelatedRulesResponse>(`/documents/${documentId}/related-rules`, { token }),
  globalSearch: (q: string, limit?: number, token?: string | null) => {
    const search = new URLSearchParams({ q });
    if (limit) search.set("limit", String(limit));
    return request<SearchGroupedResponse>(`/search?${search.toString()}`, { token });
  },
  listRulebooks: (token?: string | null) => request<Record<string, unknown>>("/rulebooks", { token }),
  reviewQueue: (token?: string | null) => request<Record<string, unknown>>("/review/queue", { token }),
  listExports: (token?: string | null) => request<Record<string, unknown>>("/exports", { token }),
  askDocument: (documentId: string, content: string, token?: string | null) =>
    request<ChatAnswerResponse>(`/chat/document/${documentId}`, { method: "POST", body: { content }, token }),
};
