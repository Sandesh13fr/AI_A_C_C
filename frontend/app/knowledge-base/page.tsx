"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";
import { apiClient, type RuleListItem } from "@/lib/api-client";
import { getSession } from "@/lib/auth";
import { titleCase } from "@/lib/utils";

function VerificationBadge({ status }: { status: string }) {
  const variant = status === "verified" ? "success" : status === "needs_review" ? "warning" : "outline";
  return <Badge variant={variant}>{status}</Badge>;
}

export default function KnowledgeBasePage() {
  const [rules, setRules] = useState<RuleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [jurisdictionFilter, setJurisdictionFilter] = useState("");

  const fetchRules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const session = getSession();
      const res = await apiClient.listRules(
        {
          q: search || undefined,
          category: categoryFilter || undefined,
          jurisdiction: jurisdictionFilter || undefined,
        },
        session?.accessToken,
      );
      setRules(res.items);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load rules");
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, jurisdictionFilter]);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  return (
    <AppShell
      title="Knowledge Base"
      subtitle="Regulatory rules, standards, guidance, and precedent references that support reviewer decisions."
    >
      <Card>
        <CardHeader>
          <CardTitle>Rules and standards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="min-w-[200px] flex-1">
              <Input
                placeholder="Search rules..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-[200px]">
              <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="">All categories</option>
                <option value="veterinary_care">Veterinary Care</option>
                <option value="housing_environment">Housing & Environment</option>
                <option value="overcrowding">Overcrowding</option>
                <option value="feeding_water">Feeding & Water</option>
                <option value="euthanasia_procedures">Euthanasia</option>
                <option value="transport_conditions">Transport</option>
              </Select>
            </div>
            <div className="w-[180px]">
              <Select value={jurisdictionFilter} onChange={(e) => setJurisdictionFilter(e.target.value)}>
                <option value="">All jurisdictions</option>
                <option value="US-FED">US Federal</option>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <EmptyState title="Unable to load rules" description={error} />
          ) : rules.length === 0 ? (
            <EmptyState
              title="No rules found"
              description="Try adjusting your search or filters."
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <tr>
                    <TableHeaderCell>Title / Citation</TableHeaderCell>
                    <TableHeaderCell>Jurisdiction</TableHeaderCell>
                    <TableHeaderCell>Category</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Verification</TableHeaderCell>
                  </tr>
                </TableHead>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <Link href={`/knowledge-base/${rule.id}`} className="text-app-teal-deep hover:underline">
                          {rule.title}
                        </Link>
                        <p className="mt-0.5 text-micro text-ink-soft">{rule.citation_label}</p>
                      </TableCell>
                      <TableCell>{rule.jurisdiction_code}</TableCell>
                      <TableCell>{titleCase(rule.welfare_category.replace(/_/g, " "))}</TableCell>
                      <TableCell>
                        <VerificationBadge status={rule.verification_status} />
                      </TableCell>
                      <TableCell>
                        {rule.version_label ? (
                          <span className="text-micro text-ink-soft">v{rule.version_label}</span>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
