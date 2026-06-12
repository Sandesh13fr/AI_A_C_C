"use client";

import { useState, type FormEvent } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { Textarea } from "@/components/ui/textarea";
import { Notice } from "@/components/ui/notice";
import { apiClient } from "@/lib/api-client";
import { getSession } from "@/lib/auth";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations: string[];
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "m-0",
    role: "assistant",
    content:
      "Ask grounded questions about this document. Answers cite the source passages and never present themselves as legal determinations.",
    citations: [],
  },
];

export default function DocumentChatPage() {
  const params = useParams();
  const documentId = (params?.id as string | undefined) ?? "";
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("What observations are supported by this document?");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!documentId) return;
    setError(null);
    setLoading(true);
    try {
      const session = getSession();
      const response = await apiClient.askDocument(documentId, input, session?.accessToken);
      setMessages((prev) => [
        ...prev,
        { id: `u-${prev.length}`, role: "user", content: input, citations: [] },
        {
          id: `a-${prev.length}`,
          role: "assistant",
          content: response.answer,
          citations: (response.citations ?? []).map((c: Record<string, unknown>) => {
            const label =
              (c.citation_label as string | undefined) ??
              (c.label as string | undefined) ??
              (c.title as string | undefined) ??
              "Citation";
            return label;
          }),
        },
      ]);
      setInput("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Chat request failed";
      setError(message);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${prev.length}`,
          role: "assistant",
          content:
            "The document chat service did not return a response. The question has been recorded locally and the audit log will show it as an unanswered query.",
          citations: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      breadcrumbs={[
        { label: "Documents", href: "/documents" },
        { label: "Document", href: documentId ? `/documents/${documentId}` : "/documents" },
        { label: "Chat" },
      ]}
      pageEyebrow="Document chat"
      pageTitle="Ask grounded questions"
      pageDescription="Conversation is scoped to this document and cites supporting passages. AI output is decision-support only — not legal advice."
    >
      <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="surface flex flex-col">
          <header className="border-b border-border px-5 py-4">
            <h2 className="font-display text-display-lg text-ink-900">Conversation</h2>
            <p className="mt-1 text-body-sm text-ink-500">
              Answers are scoped to the current document and the cited rule corpus.
            </p>
          </header>
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? "flex justify-end"
                    : "flex flex-col items-start gap-2"
                }
              >
                <div
                  className={
                    message.role === "user"
                      ? "max-w-[80%] rounded-md bg-brand px-3 py-2 text-body-sm text-white"
                      : "max-w-full space-y-2"
                  }
                >
                  {message.role === "user" ? (
                    <p>{message.content}</p>
                  ) : (
                    <>
                      <p className="text-body-md text-ink-900">{message.content}</p>
                      {message.citations.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-label uppercase text-ink-500">Citations</span>
                          {message.citations.map((label, index) => (
                            <span key={`${message.id}-cite-${index}`} className="chip chip--brand">
                              {label}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={onSubmit} className="border-t border-border p-4">
            <label className="form-label" htmlFor="chat-input">
              Ask the document
            </label>
            <Textarea
              id="chat-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="What observations are supported by this document?"
            />
            {error ? (
              <div className="mt-3">
                <Notice title="Chat error" tone="danger">
                  {error}
                </Notice>
              </div>
            ) : null}
            <div className="mt-3 flex justify-end">
              <Button
                type="submit"
                loading={loading}
                leadingIcon={<Icon name="MessageSquare" size={14} />}
              >
                {loading ? "Asking" : "Ask grounded question"}
              </Button>
            </div>
          </form>
        </div>
        <div className="space-y-6">
          <div className="surface p-4">
            <p className="text-label uppercase text-ink-500">Scope</p>
            <p className="mt-2 text-body-sm text-ink-500">Document ID</p>
            <p className="break-all font-mono text-body-sm text-ink-900">{documentId || "—"}</p>
          </div>
          <Notice title="Decision-support only" tone="warning">
            Chat remains grounded in the cited source passages. Outputs are candidate observations and
            must not be relied on as legal determinations.
          </Notice>
        </div>
      </div>
    </AppShell>
  );
}
