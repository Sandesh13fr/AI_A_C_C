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
  listRules: (token?: string | null) => request<Record<string, unknown>>("/rules", { token }),
  listRulebooks: (token?: string | null) => request<Record<string, unknown>>("/rulebooks", { token }),
  reviewQueue: (token?: string | null) => request<Record<string, unknown>>("/review/queue", { token }),
  listExports: (token?: string | null) => request<Record<string, unknown>>("/exports", { token }),
  askDocument: (documentId: string, content: string, token?: string | null) =>
    request<ChatAnswerResponse>(`/chat/document/${documentId}`, { method: "POST", body: { content }, token }),
};
