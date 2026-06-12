import { AdminShell } from "@/components/domain/admin-shell";

const ORGS = [
  { name: "Welfare Compliance Co-op", slug: "wcc", members: 12, status: "Active" },
  { name: "Midwest Poultry Alliance", slug: "mpa", members: 6, status: "Active" },
  { name: "Pacific Dairy Council", slug: "pdc", members: 3, status: "Active" },
];

export default function AdminOrgsPage() {
  return (
    <AdminShell
      title="Organisations"
      eyebrow="Admin"
      description="Tenants, members, and their inter-organisation relationships."
    >
      <div className="surface">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Slug</th>
              <th scope="col" className="text-right">
                Members
              </th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {ORGS.map((org) => (
              <tr key={org.slug}>
                <td className="text-body-md font-medium text-ink-900">{org.name}</td>
                <td>
                  <span className="font-mono text-mono-sm text-ink-700">{org.slug}</span>
                </td>
                <td className="text-right">
                  <span className="font-mono text-mono-sm text-ink-700">{org.members}</span>
                </td>
                <td>
                  <span className="chip chip--brand">{org.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
