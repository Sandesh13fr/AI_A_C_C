import { SettingsShell } from "@/components/domain/settings-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsProfilePage() {
  return (
    <SettingsShell
      title="Profile"
      eyebrow="Settings"
      description="Your display name, contact details, and review preferences."
    >
      <div className="surface p-5">
        <h2 className="section-heading">Profile</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="profile-name">
              Display name
            </label>
            <Input id="profile-name" defaultValue="A. Rivera" />
          </div>
          <div>
            <label className="form-label" htmlFor="profile-email">
              Email
            </label>
            <Input id="profile-email" type="email" defaultValue="a.rivera@example.org" />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="primary">Save profile</Button>
        </div>
      </div>
    </SettingsShell>
  );
}
