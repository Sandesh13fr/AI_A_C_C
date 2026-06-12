import { AdminShell } from "@/components/domain/admin-shell";
import { Icon } from "@/components/icon";
import Link from "next/link";

const LOGS = [
  { ts: "2026-06-12 09:14", actor: "system", action: "Run completed", ref: "A-2024-091" },
  { ts: "2026-06-12 09:14", actor: "A. Rivera", action: "Comment added", ref: "F-441" },
  { ts: "2026-06-12 08:55", actor: "J. Boyd", action: "Document uploaded", ref: "doc-007" },
  { ts: "2026-06-11 18:00", actor: "system", action: "Run queued", ref: "A-2024-091" },
  { ts: "2026-06-11 17:30", actor: "M. Chen", action: "Rule imported", ref: "kb-005" },
];

export default function AdminAuditLogsPage() {
  return (
    <AdminShell
      title="Audit logs"
      eyebrow="Admin"
      description="Platform-wide audit trail. Search and filter by actor, action, or reference."
    >
      <div className="surface">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Timestamp</th>
              <th scope="col">Actor</th>
              <th scope="col">Action</th>
              <th scope="col">Reference</th>
            </tr>
          </thead>
          <tbody>
            {LOGS.map((log, index) => (
              <tr key={index}>
                <td>
                  <span className="font-mono text-mono-sm text-ink-700">{log.ts}</span>
                </td>
                <td>{log.actor}</td>
                <td>{log.action}</td>
                <td>
                  {log.ref.startsWith("F-") ? (
                    <Link href={`/review/${log.ref}`} className="text-brand hover:underline">
                      {log.ref}
                    </Link>
                  ) : log.ref.startsWith("A-") ? (
                    <Link href={`/analysis/${log.ref}`} className="text-brand hover:underline">
                      {log.ref}
                    </Link>
                  ) : (
                    <span className="font-mono text-mono-sm text-ink-700">{log.ref}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link
        href="/admin/audit-logs"
        className="inline-flex items-center gap-2 text-label uppercase text-brand hover:underline"
      >
        <Icon name="Download" size={12} />
        Export audit log
      </Link>
    </AdminShell>
  );
}
