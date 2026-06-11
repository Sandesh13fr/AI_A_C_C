"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { getSession, setSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";

const defaultHighlights = [
  "Grounded search across documents, rules, and citations",
  "Decision-support analysis with reviewer sign-off controls",
  "Governed exports that stay blocked until human approval",
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
    const session = getSession();
    if (session) {
      router.replace(params.get("next") ?? "/dashboard");
    }
  }, [router]);

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
      router.replace(nextPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-app-bg">
      <div className="mx-auto grid min-h-dvh max-w-[1500px] gap-10 px-4 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <section className="flex items-center">
          <div className="w-full rounded-[1.75rem] border border-app-line bg-app-panel p-8 shadow-panel lg:p-12">
            <div className="max-w-2xl space-y-6">
              <div className="space-y-3">
                <p className="font-mono text-micro uppercase text-ink-soft">OpenPaws Platform</p>
                <h1 className="font-display text-[4rem] leading-[0.94] text-ink lg:text-[5.5rem]">
                  Compliance review that behaves like a real governed product.
                </h1>
                <p className="max-w-xl text-body text-ink-soft">
                  Search evidence, review candidate concerns, and ship governed reports from an authenticated workspace built for animal welfare compliance operations.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {defaultHighlights.map((highlight) => (
                  <div key={highlight} className="rounded-card border border-app-line bg-app-bg px-4 py-4">
                    <p className="font-mono text-micro uppercase text-ink-soft">Capability</p>
                    <p className="mt-3 text-body-sm text-ink">{highlight}</p>
                  </div>
                ))}
              </div>

              <Notice title="Governance model" tone="warning">
                The platform presents potential risks, possible gaps, and candidate concerns. It does not present AI output as a final legal determination.
              </Notice>
            </div>
          </div>
        </section>

        <section className="flex items-center">
          <Card className="w-full rounded-[1.75rem]">
            <CardContent className="space-y-6 px-6 py-8 lg:px-8">
              <div className="space-y-2">
                <p className="font-mono text-micro uppercase text-ink-soft">Authenticated access</p>
                <h2 className="font-display text-[2.9rem] leading-none text-ink">Sign in</h2>
                <p className="text-body-sm text-ink-soft">
                  Enter the workspace and continue to your routed destination.
                </p>
              </div>

              <label className="block">
                <span className="app-label">Email</span>
                <Input className="mt-2" value={email} onChange={(event) => setEmail(event.target.value)} />
              </label>

              <label className="block">
                <span className="app-label">Password</span>
                <Input className="mt-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              </label>

              {nextPath !== "/dashboard" ? (
                <Notice title="Redirect after sign-in">
                  You will be sent to <span className="font-mono">{nextPath}</span> after authentication.
                </Notice>
              ) : null}

              {error ? <Notice title="Sign-in error">{error}</Notice> : null}

              <Button className="w-full" loading={loading} onClick={submit}>
                {loading ? "Signing in" : "Open workspace"}
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
