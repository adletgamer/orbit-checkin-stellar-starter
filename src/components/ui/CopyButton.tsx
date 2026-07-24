import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Tooltip } from "./Tooltip";

export function CopyButton({
  value,
  label = "Copy",
  onCopy,
}: {
  value: string;
  label?: string;
  onCopy: (message: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopy(`${label} copied`);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      onCopy(`Could not copy ${label.toLowerCase()}`);
    }
  }

  return (
    <Tooltip label={copied ? "Copied" : label}>
      <button
        type="button"
        onClick={copyValue}
        aria-label={`Copy ${label.toLowerCase()}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle bg-surface-elevated text-text-secondary transition hover:text-text-primary"
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
      </button>
    </Tooltip>
  );
}
