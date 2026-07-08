import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { copy } from "../../content/copy";
import { cn } from "../../utils/classNames";

export function EducationDisclosure({ visible }: { visible: boolean }) {
  const [open, setOpen] = useState(false);

  if (!visible) return null;

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-elevated/60">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left font-semibold text-text-primary"
      >
        {copy.education.title}
        <ChevronDown className={cn("transition", open && "rotate-180")} size={18} />
      </button>
      {open ? (
        <ol className="space-y-2 border-t border-border-subtle px-4 py-4 text-sm text-text-secondary">
          {copy.education.steps.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="font-mono text-xs text-cyan">{index + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
