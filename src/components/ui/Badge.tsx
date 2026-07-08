import type { ReactNode } from "react";
import { cn } from "../../utils/classNames";

type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger";

const tones: Record<BadgeTone, string> = {
  neutral: "border-border-subtle bg-surface-elevated text-text-secondary",
  info: "border-info/35 bg-info/10 text-info",
  success: "border-success/35 bg-success/10 text-success",
  warning: "border-warning/35 bg-warning/10 text-warning",
  danger: "border-danger/35 bg-danger/10 text-danger",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
