import { AdminShell } from "@/components/domain/admin-shell";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";

const USERS = [
  { name: "Alex Rivera", email: "a.rivera@example.org", role: "Legal reviewer", lastSeen: "2h ago" },
  { name: "Jordan Boyd", email: "j.boyd@example.org", role: "Compliance analyst", lastSeen: "Today" },
  { name: "Morgan Chen", email: "m.chen@example.org", role: "Policy researcher", lastSeen: "Yesterday" },
];

export default function AdminUsersPage() {
  return (
    <AdminShell
      title="Users"
      eyebrow="Admin"
      description="Members of your organisation and the roles they hold. Invite and assign roles from this surface."
      actions={
        <Button variant="primary" leadingIcon={<Icon name="Plus" size={14} />}>
          Invite member
        </Button>
      }
    >
      <div className="surface">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col" className="text-right">
                Last seen
              </th>
            </tr>
          </thead>
          <tbody>
            {USERS.map((user) => (
              <tr key={user.email}>
                <td>
                  <p className="text-body-md font-medium text-ink-900">{user.name}</p>
                </td>
                <td>
                  <span className="font-mono text-mono-sm text-ink-700">{user.email}</span>
                </td>
                <td>
                  <span className="chip">{user.role}</span>
                </td>
                <td className="text-right">
                  <span className="font-mono text-mono-sm text-ink-500">{user.lastSeen}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
