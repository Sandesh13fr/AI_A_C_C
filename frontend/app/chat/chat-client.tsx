"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@/lib/api-client";
import { getSession } from "@/lib/auth";

export function ChatClient() {
  const params = useSearchParams();
  const documentId = params.get("document") ?? "00000000-0000-4000-8000-000000000003";
  const [message, setMessage] = useState("What observations are supported by this document?");
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function ask() {
    setLoading(true);
    setError(null);
    try {
      const session = getSession();
      const response = await apiClient.askDocument(documentId, message, session?.accessToken);
      setAnswer(response.answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chat request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>Document-scoped chat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Notice title="Scope" tone="warning">
            Chat remains grounded to the selected document and cited source context. This surface must not be used as a global legal chatbot.
          </Notice>
          <label className="block">
            <span className="app-label">Message</span>
            <Textarea className="mt-2" value={message} onChange={(event) => setMessage(event.target.value)} />
          </label>
          <Button loading={loading} onClick={ask}>
            {loading ? "Asking" : "Ask grounded question"}
          </Button>
          {error ? <Notice title="Chat error">{error}</Notice> : null}
          {answer ? (
            <div className="rounded-card border border-app-line bg-app-bg px-4 py-4">
              <p className="app-label">Answer</p>
              <p className="mt-3 text-body-sm text-ink">{answer}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current context</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-body-sm text-ink-soft">Document scope</p>
          <p className="break-all font-mono text-body-sm text-ink">{documentId}</p>
          <p className="text-body-sm text-ink-soft">Returned citations and snippets can be rendered here when the backend provides richer chat payloads.</p>
        </CardContent>
      </Card>
    </div>
  );
}
