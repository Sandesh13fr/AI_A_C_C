import { AdminShell } from "@/components/domain/admin-shell";
import { StatCard } from "@/components/domain/stat-card";

export default function AdminEvaluationDetailPage({ params }: { params: Promise<{ evalRunId: string }> }) {
  return (
    <AdminShell
      title="Evaluation detail"
      eyebrow="Admin"
      description="Drill-down metrics for this evaluation run."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Precision" value="0.86" description="Per-severity breakdown available in the table below." />
        <StatCard label="Recall" value="0.81" description="Coverage of expert-labelled findings." />
        <StatCard label="F1" value="0.83" description="Harmonic mean of precision and recall." />
      </div>
      <div className="surface p-5">
        <p className="text-label uppercase text-ink-500">Per-severity metrics</p>
        <table className="data-table mt-3">
          <thead>
            <tr>
              <th scope="col">Severity</th>
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
            <tr>
              <td>Critical</td>
              <td className="text-right font-mono text-mono-sm text-ink-700">0.92</td>
              <td className="text-right font-mono text-mono-sm text-ink-700">0.88</td>
              <td className="text-right font-mono text-mono-sm text-ink-700">0.90</td>
            </tr>
            <tr>
              <td>High</td>
              <td className="text-right font-mono text-mono-sm text-ink-700">0.86</td>
              <td className="text-right font-mono text-mono-sm text-ink-700">0.82</td>
              <td className="text-right font-mono text-mono-sm text-ink-700">0.84</td>
            </tr>
            <tr>
              <td>Medium</td>
              <td className="text-right font-mono text-mono-sm text-ink-700">0.80</td>
              <td className="text-right font-mono text-mono-sm text-ink-700">0.78</td>
              <td className="text-right font-mono text-mono-sm text-ink-700">0.79</td>
            </tr>
            <tr>
              <td>Low</td>
              <td className="text-right font-mono text-mono-sm text-ink-700">0.74</td>
              <td className="text-right font-mono text-mono-sm text-ink-700">0.71</td>
              <td className="text-right font-mono text-mono-sm text-ink-700">0.72</td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
