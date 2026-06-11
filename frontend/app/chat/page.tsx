import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { ChatClient } from "./chat-client";

export default function ChatPage() {
  return (
    <AppShell title="Chat" subtitle="Document-scoped conversation with grounded source context and review-safe disclaimers.">
      <Suspense
        fallback={
          <Card>
            <CardContent>Loading chat workspace.</CardContent>
          </Card>
        }
      >
        <ChatClient />
      </Suspense>
    </AppShell>
  );
}
