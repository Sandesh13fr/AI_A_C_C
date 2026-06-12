"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { getSession, setSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { Icon } from "@/components/icon";

const HIGHLIGHTS = [
  "Grounded search across documents, rules, and citations.",
  "Decision-support analysis with reviewer sign-off controls.",
  "Governed exports that stay blocked until human approval.",
];

export default function LoginPage() {
  const router = useRouter();
  const [nextPath, setNextPath] = useState("/dashboard");
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("test1234");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(params.get("next") ?? "/dashboard");
    if (getSession()) {
      router.replace(params.get("next") ?? "/dashboard");
    }
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
        role: response.user.org_role === "org_admin" ? "org_admin" : "compliance_analyst",
      });
      router.replace(nextPath);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Sign in failed. The dev backend may be unreachable — use test credentials to explore the UI locally.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-ink-50">
      <div className="mx-auto grid min-h-dvh max-w-[1200px] gap-10 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <section className="flex items-center">
          <div className="w-full">
            <div className="flex items-center gap-2">
              <span
                className="flex size-9 items-center justify-center rounded-sm bg-brand text-white"
                aria-hidden="true"
              >
                <PawsMark size={18} />
              </span>
              <span className="font-display text-[24px] leading-none text-ink-900">OpenPaws</span>
            </div>
            <h1 className="mt-8 font-display text-display-xl text-ink-900">
              Compliance review with evidence, not verdicts.
            </h1>
            <p className="mt-4 max-w-xl text-body-md text-ink-600">
              Upload animal welfare documents, search applicable standards, and review AI-assisted
              potential risks with citations and human sign-off.
            </p>
            <ul className="mt-8 space-y-3">
              {HIGHLIGHTS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-md border border-border bg-white p-3 text-body-sm text-ink-700"
                >
                  <span className="mt-0.5 flex size-5 items-center justify-center rounded-sm bg-brand-light text-brand">
                    <Icon name="Check" size={12} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Notice title="Governance model" tone="warning" className="mt-8 max-w-xl">
              The platform surfaces potential risks, possible gaps, and candidate concerns. It does not
              present AI output as a final legal determination.
            </Notice>
          </div>
        </section>

        <section className="flex items-center">
          <form onSubmit={submit} className="w-full rounded-lg border border-border bg-white p-8">
            <p className="text-label uppercase text-ink-500">Authenticated access</p>
            <h2 className="mt-2 font-display text-display-lg text-ink-900">Sign in</h2>
            <p className="mt-1 text-body-sm text-ink-500">
              Enter your workspace credentials to continue.
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <label className="form-label" htmlFor="login-email">
                  Email
                </label>
                <Input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div>
                <label className="form-label" htmlFor="login-password">
                  Password
                </label>
                <Input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              {nextPath !== "/dashboard" ? (
                <Notice title="Redirect after sign-in">
                  You will be sent to <span className="font-mono">{nextPath}</span>.
                </Notice>
              ) : null}
              {error ? <Notice title="Sign-in error" tone="danger">{error}</Notice> : null}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <Link href="/forgot-password" className="text-label uppercase text-brand hover:underline">
                Forgot password
              </Link>
              <Button type="submit" variant="primary" loading={loading}>
                {loading ? "Signing in" : "Sign in"}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

function PawsMark({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="6" cy="10" r="2.4" />
      <circle cx="10" cy="6" r="2.4" />
      <circle cx="14" cy="6" r="2.4" />
      <circle cx="18" cy="10" r="2.4" />
      <path d="M12 11c-3 0-6 2.5-6 5.5 0 2 1.6 3.5 3.5 3.5 1 0 1.7-.3 2.5-.7.7-.4 1-.4 1.7 0 .8.4 1.5.7 2.5.7 1.9 0 3.5-1.5 3.5-3.5C18 13.5 15 11 12 11z" />
    </svg>
  );
}
