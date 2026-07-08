import { ExternalLink } from "lucide-react";
import { copy } from "../../content/copy";
import { transactionLabUrl } from "../../lib/stellarLab";
import { Button } from "../ui/Button";
import { CopyButton } from "../ui/CopyButton";

function shortHash(hash: string) {
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

export function TransactionResult({
  hash,
  onCopy,
}: {
  hash?: string;
  onCopy: (message: string) => void;
}) {
  if (!hash) return null;

  return (
    <div className="rounded-2xl border border-success/30 bg-success/10 p-4">
      <p className="font-semibold text-success">{copy.card.title.replace("On-chain ", "Check-in ")}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <code className="rounded-lg border border-border-subtle bg-background/40 px-2 py-1 font-mono text-xs text-text-secondary">
          {shortHash(hash)}
        </code>
        <CopyButton value={hash} label={copy.actions.copyHash} onCopy={onCopy} />
      </div>
      <a
        href={transactionLabUrl(hash)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View transaction in Stellar Lab"
        className="mt-4 inline-flex"
      >
        <Button type="button" variant="secondary" icon={<ExternalLink size={15} />}>
          {copy.actions.viewLab}
        </Button>
      </a>
    </div>
  );
}
