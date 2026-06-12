import Link from "next/link";
import { Icon, type IconName } from "@/components/icon";

interface QuickActionItemProps {
  label: string;
  description: string;
  href: string;
  icon: IconName;
}

export function QuickActionItem({ label, description, href, icon }: QuickActionItemProps) {
  return (
    <Link href={href} className="quick-action group">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-brand-light text-brand transition-colors group-hover:bg-brand group-hover:text-white">
        <Icon name={icon} size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-body-md font-medium text-ink-900">{label}</span>
        <span className="block text-body-sm text-ink-500">{description}</span>
      </span>
      <Icon name="ChevronRight" size={16} className="text-ink-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
    </Link>
  );
}
