"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
  }

  return (
    <div className="min-h-dvh bg-ink-50">
      <div className="mx-auto flex min-h-dvh max-w-[480px] items-center px-6 py-10">
        <form onSubmit={submit} className="w-full rounded-lg border border-border bg-white p-8">
          <p className="text-label uppercase text-ink-500">Set new password</p>
          <h1 className="mt-2 font-display text-display-lg text-ink-900">Choose a new password</h1>
          <p className="mt-1 text-body-sm text-ink-500">
            Use at least 8 characters. We&apos;ll sign you in automatically when you save.
          </p>
          <div className="mt-6 space-y-4">
            <div>
              <label className="form-label" htmlFor="reset-password">
                New password
              </label>
              <Input
                id="reset-password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div>
              <label className="form-label" htmlFor="reset-confirm">
                Confirm password
              </label>
              <Input
                id="reset-confirm"
                type="password"
                required
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
              />
            </div>
            {error ? (
              <Notice title="Check the password" tone="danger">
                {error}
              </Notice>
            ) : null}
          </div>
          <div className="mt-6 flex items-center justify-between">
            <Link href="/login" className="text-label uppercase text-brand hover:underline">
              Back to sign in
            </Link>
            <Button type="submit" variant="primary">
              Set new password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
