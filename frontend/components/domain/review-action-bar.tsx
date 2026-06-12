"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

interface ReviewActionBarProps {
  onAccept?: () => void;
  onDismiss?: () => void;
  onFlag?: () => void;
  onSignOff?: () => void;
  disabled?: boolean;
}

export function ReviewActionBar({ onAccept, onDismiss, onFlag, onSignOff, disabled }: ReviewActionBarProps) {
  const [note, setNote] = useState("");
  return (
    <div className="surface p-5">
      <p className="text-label uppercase text-ink-500">Reviewer actions</p>
      <div className="mt-3 space-y-2">
        <Button
          className="w-full"
          variant="primary"
          onClick={onAccept}
          disabled={disabled}
          leadingIcon={<Icon name="Check" size={14} />}
        >
          Accept candidate concern
        </Button>
        <Button className="w-full" variant="secondary" onClick={onFlag} disabled={disabled}>
          Flag for review
        </Button>
        <Button className="w-full" variant="danger" onClick={onDismiss} disabled={disabled}>
          Dismiss
        </Button>
      </div>
      <div className="mt-5">
        <label className="form-label" htmlFor="reviewer-note">
          Reviewer note
        </label>
        <Textarea
          id="reviewer-note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Add rationale, evidence links, or sign-off context."
        />
      </div>
      <Button
        className={cn("mt-3 w-full")}
        variant="secondary"
        onClick={onSignOff}
        disabled={disabled}
        leadingIcon={<Icon name="Check" size={14} />}
      >
        Sign off finding
      </Button>
    </div>
  );
}
