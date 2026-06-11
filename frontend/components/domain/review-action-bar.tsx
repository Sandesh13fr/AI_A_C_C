"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ReviewActionBar() {
  const [note, setNote] = useState("");

  return (
    <div className="app-panel p-5">
      <p className="app-label">Review actions</p>
      <div className="mt-4 grid gap-3">
        <Button variant="primary">Accept candidate concern</Button>
        <Button variant="secondary">Dismiss</Button>
        <Button variant="ghost">Request edits</Button>
      </div>
      <label className="mt-5 block">
        <span className="app-label">Reviewer note</span>
        <Textarea className="mt-2 min-h-24" value={note} onChange={(event) => setNote(event.target.value)} />
      </label>
      <Button className="mt-4 w-full" variant="secondary">
        Save note
      </Button>
    </div>
  );
}
