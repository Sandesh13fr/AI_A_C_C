import { Icon } from "@/components/icon";

type Tone = "ok" | "info" | "warning" | "critical";

const dotByTone: Record<Tone, string> = {
  ok: "bg-emerald-500",
  info: "bg-ink-400",
  warning: "bg-accent-gold",
  critical: "bg-[#D92D20]",
};

export function StatusDot({ tone = "info" }: { tone?: Tone }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block size-2 shrink-0 rounded-full ${dotByTone[tone]}`}
    />
  );
}

interface SystemStatusListProps {
  items: Array<{ key: string; value: string; tone: Tone; timestamp?: boolean }>;
}

export function SystemStatusList({ items }: SystemStatusListProps) {
  return (
    <dl className="space-y-3">
      {items.map((item) => (
        <div key={item.key} className="flex items-center justify-between gap-4 text-body-sm">
          <dt className="flex items-center gap-2 text-ink-500">
            <StatusDot tone={item.tone} />
            {item.key}
          </dt>
          <dd
            className={item.timestamp ? "font-mono text-ink-700" : "text-ink-900"}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
