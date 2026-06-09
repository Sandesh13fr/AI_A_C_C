"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import { getSession } from "@/lib/auth";

export function ChatClient() {
  const params = useSearchParams();
  const documentId = params.get("document") ?? "00000000-0000-4000-8000-000000000003";
  const [message, setMessage] = useState("What observations are supported by this document?");
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function ask() {
    setError(null);
    try {
      const session = getSession();
      const response = await apiClient.askDocument(documentId, message, session?.accessToken);
      setAnswer(response.answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chat request failed");
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <Card>
        <label className="block text-body-sm">
          Message
          <textarea
            className="mt-1 min-h-32 w-full rounded-button border border-dark-border bg-dark-surface px-3 py-2"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </label>
        <button className="mt-4 rounded-button bg-teal px-4 py-2 text-body-sm font-semibold text-white" onClick={ask}>
          Ask
        </button>
        {error ? <p className="mt-3 text-body-sm text-coral">{error}</p> : null}
        {answer ? (
          <div className="mt-5 rounded-card border border-dark-border bg-dark-surface p-4">
            <p className="text-body-sm text-pretty">{answer}</p>
          </div>
        ) : null}
      </Card>
      <Card>
        <h2 className="text-h3 text-balance">Scope</h2>
        <p className="mt-2 break-all font-mono text-micro text-mid-grey">{documentId}</p>
      </Card>
    </div>
  );
}
