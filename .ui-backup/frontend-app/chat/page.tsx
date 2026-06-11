import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { ChatClient } from "./chat-client";

export default function ChatPage() {
  return (
    <AppShell title="Chat" subtitle="Document-scoped questions with citation validation and no legal determinations.">
      <Suspense
        fallback={
          <Card>
            <p className="text-body-sm text-mid-grey">Loading chat.</p>
          </Card>
        }
      >
        <ChatClient />
      </Suspense>
    </AppShell>
  );
}
