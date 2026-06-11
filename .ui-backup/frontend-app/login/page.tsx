"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { setSession } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("test1234");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.login(email, password);
      setSession({
        accessToken: response.access_token,
        user: {
          id: response.user.id,
          email: response.user.email,
          name: response.user.full_name,
        },
        organisation: {
          id: response.user.organization_id ?? "00000000-0000-4000-8000-000000000001",
          name: "Development Organization",
          slug: "dev-org",
        },
        role: response.user.org_role === "org_admin" ? "org_admin" : "viewer",
      });
      window.location.href = "/search";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-dark-surface p-5">
      <div className="w-full max-w-sm rounded-card border border-dark-border bg-dark-card p-5">
        <h1 className="mb-2 text-h2 text-balance">Sign in to OpenPaws</h1>
        <p className="mb-5 text-body-sm text-mid-grey text-pretty">
          Access the compliance intelligence workspace with review-safe defaults.
        </p>
        <label className="mb-3 block text-body-sm">
          Email
          <input
            className="mt-1 w-full rounded-button border border-dark-border bg-dark-surface px-3 py-2 text-white"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="mb-4 block text-body-sm">
          Password
          <input
            className="mt-1 w-full rounded-button border border-dark-border bg-dark-surface px-3 py-2 text-white"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error ? <p className="mb-3 text-body-sm text-coral">{error}</p> : null}
        <button
          className="w-full rounded-button bg-teal px-4 py-2.5 text-body-sm font-semibold text-white disabled:opacity-50"
          disabled={loading}
          onClick={submit}
        >
          {loading ? "Signing in" : "Sign in"}
        </button>
      </div>
    </div>
  );
}
