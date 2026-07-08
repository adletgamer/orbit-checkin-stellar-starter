import { Check, X } from "lucide-react";
import { cn } from "../../utils/classNames";
import type { StepKey, StepState } from "../../features/demo/demoStates";

const labels: Record<StepKey, string> = {
  prepare: "Prepare",
  sign: "Sign",
  confirm: "Confirm",
};

const order: StepKey[] = ["prepare", "sign", "confirm"];

export function TransactionStepper({ steps }: { steps: Record<StepKey, StepState> }) {
  return (
    <ol className="grid grid-cols-3 gap-2 sm:gap-3" aria-label="Transaction progress">
      {order.map((step) => {
        const state = steps[step];
        const isActive = state === "active";
        const isDone = state === "complete";
        const isError = state === "error";

        return (
          <li
            key={step}
            className={cn(
              "rounded-2xl border px-3 py-3 transition",
              isActive && "border-info/50 bg-info/10",
              isDone && "border-success/45 bg-success/10",
              isError && "border-danger/50 bg-danger/10",
              state === "pending" && "border-border-subtle bg-surface-elevated/55",
            )}
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border text-xs",
                  isActive && "animate-pulse border-info text-info",
                  isDone && "border-success bg-success text-background",
                  isError && "border-danger bg-danger text-background",
                  state === "pending" && "border-border-strong text-text-muted",
                )}
              >
                {isDone ? <Check size={14} /> : isError ? <X size={14} /> : order.indexOf(step) + 1}
              </span>
              <span className="text-text-primary">{labels[step]}</span>
            </span>
            <span className="mt-1 block text-xs capitalize text-text-muted">{state}</span>
          </li>
        );
      })}
    </ol>
  );
}
