import { SettingsShell } from "@/components/domain/settings-shell";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";

const API_KEYS = [
  { id: "key-001", name: "Workspace admin", created: "2026-04-12", lastUsed: "Today" },
  { id: "key-002", name: "CI ingest", created: "2026-05-02", lastUsed: "Yesterday" },
];

export default function SettingsApiKeysPage() {
  return (
    <SettingsShell
      title="API keys"
      eyebrow="Settings"
      description="Programmatic access to the OpenPaws API. Create, rotate, and revoke keys from this surface."
      actions={
        <Button variant="primary" leadingIcon={<Icon name="Plus" size={14} />}>
          New API key
        </Button>
      }
    >
      <div className="surface">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">ID</th>
              <th scope="col" className="text-right">
                Created
              </th>
              <th scope="col" className="text-right">
                Last used
              </th>
            </tr>
          </thead>
          <tbody>
            {API_KEYS.map((key) => (
              <tr key={key.id}>
                <td className="text-body-md font-medium text-ink-900">{key.name}</td>
                <td>
                  <span className="font-mono text-mono-sm text-ink-700">{key.id}</span>
                </td>
                <td className="text-right font-mono text-mono-sm text-ink-700">{key.created}</td>
                <td className="text-right font-mono text-mono-sm text-ink-700">{key.lastUsed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SettingsShell>
  );
}
