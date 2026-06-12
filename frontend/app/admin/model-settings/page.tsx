import { AdminShell } from "@/components/domain/admin-shell";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function AdminModelSettingsPage() {
  return (
    <AdminShell
      title="Model settings"
      eyebrow="Admin"
      description="Model selection, retrieval parameters, and analysis defaults for the platform."
    >
      <div className="surface p-5">
        <h2 className="section-heading">Defaults</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="model">
              Default analysis model
            </label>
            <Select id="model" defaultValue="openai-gpt-4.1">
              <option value="openai-gpt-4.1">OpenAI · GPT-4.1</option>
              <option value="openrouter-default">OpenRouter default</option>
              <option value="local-llama">Local Llama (preview)</option>
            </Select>
          </div>
          <div>
            <label className="form-label" htmlFor="top-k">
              Retrieval top-k
            </label>
            <Input id="top-k" type="number" defaultValue={12} />
          </div>
          <div>
            <label className="form-label" htmlFor="confidence-floor">
              Confidence floor for findings
            </label>
            <Input id="confidence-floor" type="number" step="0.05" defaultValue={0.55} />
          </div>
          <div>
            <label className="form-label" htmlFor="max-citations">
              Max citations per finding
            </label>
            <Input id="max-citations" type="number" defaultValue={3} />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="primary">Save defaults</Button>
        </div>
      </div>
    </AdminShell>
  );
}
