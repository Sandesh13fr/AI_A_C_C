import { AdminShell } from "@/components/domain/admin-shell";
import { StatusBadge } from "@/components/domain/status-badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";

const SOURCES = [
  { id: "usda-aphis", name: "USDA APHIS", kind: "Federal", lastSync: "2h ago", state: "approved" },
  { id: "ca-cdfa", name: "CA CDFA", kind: "State", lastSync: "1d ago", state: "approved" },
  { id: "eu-eur-lex", name: "EUR-Lex", kind: "Multi", lastSync: "12h ago", state: "needs_review" },
  { id: "rspca", name: "RSPCA Assured", kind: "NGO", lastSync: "3d ago", state: "draft" },
];

export default function AdminDataSourcesPage() {
  return (
    <AdminShell
      title="Data sources"
      eyebrow="Admin"
      description="External feeds that the platform ingests from. Control sync schedules, scopes, and verification status."
      actions={
        <Button variant="primary" leadingIcon={<Icon name="Plus" size={14} />}>
          Add source
        </Button>
      }
    >
      <div className="surface">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Type</th>
              <th scope="col" className="text-right">
                Last sync
              </th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {SOURCES.map((source) => (
              <tr key={source.id}>
                <td className="text-body-md font-medium text-ink-900">{source.name}</td>
                <td>
                  <span className="chip">{source.kind}</span>
                </td>
                <td className="text-right">
                  <span className="font-mono text-mono-sm text-ink-700">{source.lastSync}</span>
                </td>
                <td>
                  <StatusBadge status={source.state} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
