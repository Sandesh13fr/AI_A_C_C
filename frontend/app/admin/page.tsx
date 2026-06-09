import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
};

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-7xl p-5">
      <h1 className="text-h2 mb-2">Admin</h1>
      <p className="text-body-sm text-mid-grey mb-6">
        Organisation settings, user management, security configuration, and
        audit logs.
      </p>
    </div>
  );
}
