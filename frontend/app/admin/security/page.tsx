import { AdminShell } from "@/components/domain/admin-shell";
import { StatusBadge } from "@/components/domain/status-badge";

const SETTINGS = [
  { label: "SSO enforcement", value: "Required for admins", state: "approved" },
  { label: "Audit log retention", value: "365 days", state: "approved" },
  { label: "IP allowlist", value: "Configured", state: "approved" },
  { label: "MFA", value: "Optional", state: "needs_review" },
];

export default function AdminSecurityPage() {
  return (
    <AdminShell
      title="Security"
      eyebrow="Admin"
      description="Authentication, authorization, and platform security controls."
    >
      <div className="surface">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Control</th>
              <th scope="col">Value</th>
              <th scope="col">State</th>
            </tr>
          </thead>
          <tbody>
            {SETTINGS.map((row) => (
              <tr key={row.label}>
                <td className="text-body-md font-medium text-ink-900">{row.label}</td>
                <td>{row.value}</td>
                <td>
                  <StatusBadge status={row.state} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
