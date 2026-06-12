"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setSubmitted(true);
  }

  return (
    <div className="min-h-dvh bg-ink-50">
      <div className="mx-auto flex min-h-dvh max-w-[480px] items-center px-6 py-10">
        <form onSubmit={submit} className="w-full rounded-lg border border-border bg-white p-8">
          <p className="text-label uppercase text-ink-500">Forgot password</p>
          <h1 className="mt-2 font-display text-display-lg text-ink-900">Reset your password</h1>
          <p className="mt-1 text-body-sm text-ink-500">
            Enter the email associated with your account. We&apos;ll send a reset link if it exists.
          </p>
          <div className="mt-6 space-y-4">
            <div>
              <label className="form-label" htmlFor="forgot-email">
                Email
              </label>
              <Input
                id="forgot-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            {error ? (
              <Notice title="Check the email" tone="danger">
                {error}
              </Notice>
            ) : null}
            {submitted ? (
              <Notice title="Reset link sent" tone="success">
                If an account exists for <span className="font-mono">{email}</span>, a reset link is on
                its way.
              </Notice>
            ) : null}
          </div>
          <div className="mt-6 flex items-center justify-between">
            <Link href="/login" className="text-label uppercase text-brand hover:underline">
              Back to sign in
            </Link>
            <Button type="submit" variant="primary">
              Send reset link
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
