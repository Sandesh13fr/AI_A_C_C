import { AdminShell } from "@/components/domain/admin-shell";
import { StatCard } from "@/components/domain/stat-card";

const EVAL_RUNS = [
  { id: "eval-2026-06", date: "2026-06-12", precision: 0.86, recall: 0.81, f1: 0.83 },
  { id: "eval-2026-05", date: "2026-05-30", precision: 0.84, recall: 0.79, f1: 0.81 },
  { id: "eval-2026-04", date: "2026-04-28", precision: 0.82, recall: 0.78, f1: 0.80 },
];

export default function AdminEvaluationsPage() {
  return (
    <AdminShell
      title="Evaluations"
      eyebrow="Admin"
      description="Evaluation runs and metrics for the analysis pipeline. Drill into individual runs for details."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Latest precision" value="0.86" description="Average across severity buckets." />
        <StatCard label="Latest recall" value="0.81" description="Coverage of expert-labelled findings." />
        <StatCard label="Latest F1" value="0.83" description="Harmonic mean of precision and recall." />
      </div>
      <div className="surface">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Run ID</th>
              <th scope="col" className="text-right">
                Date
              </th>
              <th scope="col" className="text-right">
                Precision
              </th>
              <th scope="col" className="text-right">
                Recall
              </th>
              <th scope="col" className="text-right">
                F1
              </th>
            </tr>
          </thead>
          <tbody>
            {EVAL_RUNS.map((run) => (
              <tr key={run.id}>
                <td>
                  <a href={`/admin/evaluations/${run.id}`} className="font-mono text-mono-sm text-ink-700 hover:text-brand">
                    {run.id}
                  </a>
                </td>
                <td className="text-right font-mono text-mono-sm text-ink-700">{run.date}</td>
                <td className="text-right font-mono text-mono-sm text-ink-700">{run.precision.toFixed(2)}</td>
                <td className="text-right font-mono text-mono-sm text-ink-700">{run.recall.toFixed(2)}</td>
                <td className="text-right font-mono text-mono-sm text-ink-700">{run.f1.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
