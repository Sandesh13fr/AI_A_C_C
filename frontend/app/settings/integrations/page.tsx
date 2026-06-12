import { SettingsShell } from "@/components/domain/settings-shell";
import { StatusBadge } from "@/components/domain/status-badge";

const INTEGRATIONS = [
  { name: "USDA APHIS feed", kind: "Federal", state: "approved" },
  { name: "CA CDFA feed", kind: "State", state: "approved" },
  { name: "EUR-Lex", kind: "Multi", state: "needs_review" },
  { name: "RSPCA Assured", kind: "NGO", state: "draft" },
];

export default function SettingsIntegrationsPage() {
  return (
    <SettingsShell
      title="Integrations"
      eyebrow="Settings"
      description="External data sources and connectors. Add or pause sources from this surface."
    >
      <div className="surface">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Type</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {INTEGRATIONS.map((row) => (
              <tr key={row.name}>
                <td className="text-body-md font-medium text-ink-900">{row.name}</td>
                <td>
                  <span className="chip">{row.kind}</span>
                </td>
                <td>
                  <StatusBadge status={row.state} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SettingsShell>
  );
}
