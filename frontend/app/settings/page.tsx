import { SettingsShell } from "@/components/domain/settings-shell";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Link from "next/link";

export default function SettingsIndexPage() {
  return (
    <SettingsShell
      title="Settings"
      description="Workspace preferences, profile, and integrations. Pick a sub-section on the left to begin."
    >
      <div className="surface p-5">
        <h2 className="section-heading">Welcome</h2>
        <p className="mt-2 text-body-sm text-ink-500">
          Use the sub-nav to manage your profile, notifications, appearance, integrations, and API keys.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {[
            { label: "Profile", href: "/settings/profile" },
            { label: "Notifications", href: "/settings/notifications" },
            { label: "Appearance", href: "/settings/appearance" },
            { label: "Integrations", href: "/settings/integrations" },
            { label: "API keys", href: "/settings/api-keys" },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="quick-action"
              >
                <span className="flex-1 text-body-md font-medium text-ink-900">{link.label}</span>
                <Icon name="ChevronRight" size={14} className="text-ink-400" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </SettingsShell>
  );
}

function Icon({ name, size = 16, className }: { name: "ChevronRight"; size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

// Helper for redirecting unauthenticated users (not used here but kept for future re-use).
export async function ensureAuth() {
  const session = getSession();
  if (!session) redirect("/login");
}
