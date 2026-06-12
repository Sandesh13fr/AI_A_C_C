import { SettingsShell } from "@/components/domain/settings-shell";
import { Checkbox } from "@/components/ui/checkbox";

export default function SettingsNotificationsPage() {
  return (
    <SettingsShell
      title="Notifications"
      eyebrow="Settings"
      description="Email, in-app, and watchlist alert preferences."
    >
      <div className="surface p-5">
        <h2 className="section-heading">Channels</h2>
        <ul className="mt-3 space-y-1">
          <Checkbox label="Email digest" defaultChecked />
          <Checkbox label="In-app alerts" defaultChecked />
          <Checkbox label="Watchlist alerts" defaultChecked />
        </ul>
        <h2 className="mt-6 section-heading">Triggers</h2>
        <ul className="mt-3 space-y-1">
          <Checkbox label="Critical findings" defaultChecked />
          <Checkbox label="High severity findings" defaultChecked />
          <Checkbox label="Medium and low severity findings" />
        </ul>
      </div>
    </SettingsShell>
  );
}
