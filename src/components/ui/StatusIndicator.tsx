import { cn } from "../../utils/classNames";
import type { Tone } from "../../features/demo/demoStates";

const toneClass: Record<Tone, string> = {
  neutral: "bg-text-muted",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export function StatusIndicator({ tone, label }: { tone: Tone; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-text-secondary">
      <span className={cn("h-2.5 w-2.5 rounded-full", toneClass[tone])} aria-hidden="true" />
      {label}
    </span>
  );
}
