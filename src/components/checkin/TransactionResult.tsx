import { ExternalLink, RotateCcw } from "lucide-react";
import { transactionLabUrl } from "../../lib/stellarLab";
import { Button } from "../ui/Button";
import { CopyButton } from "../ui/CopyButton";

function shortValue(value: string, start = 10, end = 8) {
  if (value.length <= start + end + 3) return value;
  return `${value.slice(0, start)}...${value.slice(-end)}`;
}

function Detail({ label, value, copyValue, onCopy }: { label: string; value: string; copyValue?: string; onCopy: (message: string) => void }) {
  return (
    <div className="min-w-0 border-b border-border-subtle py-3 last:border-0">
      <p className="text-xs font-medium text-text-muted">{label}</p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <code className="min-w-0 truncate font-mono text-xs text-text-primary" title={copyValue || value}>{value}</code>
        {copyValue ? <CopyButton value={copyValue} label={label} onCopy={onCopy} /> : null}
      </div>
    </div>
  );
}

export function TransactionResult({ hash, ledger, confirmedAt, contractId, walletAddress, onCopy, onCreateAnother }: {
  hash: string;
  ledger?: number;
  confirmedAt?: string;
  contractId: string;
  walletAddress?: string;
  onCopy: (message: string) => void;
  onCreateAnother: () => void;
}) {
  const explorerUrl = transactionLabUrl(hash);
  const date = confirmedAt
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(confirmedAt))
    : "Just now";

  return (
    <div className="rounded-2xl border border-success/30 bg-success/[0.07] p-4 sm:p-5">
      <div className="grid sm:grid-cols-2 sm:gap-x-5">
        <Detail label="Transaction hash" value={shortValue(hash)} copyValue={hash} onCopy={onCopy} />
        <Detail label="Ledger" value={ledger ? ledger.toLocaleString() : "Pending index"} onCopy={onCopy} />
        <Detail label="Date & time" value={date} onCopy={onCopy} />
        <Detail label="Network" value="Stellar Testnet" onCopy={onCopy} />
        <Detail label="Contract" value={shortValue(contractId)} copyValue={contractId} onCopy={onCopy} />
        <Detail label="Signing wallet" value={walletAddress ? shortValue(walletAddress) : "Demo wallet"} copyValue={walletAddress} onCopy={onCopy} />
      </div>

      <div className="mt-4 grid gap-2">
        <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="inline-flex" aria-label="View transaction on Stellar Explorer">
          <Button type="button" className="w-full" icon={<ExternalLink size={16} />}>View on Stellar Explorer</Button>
        </a>
        <Button type="button" variant="secondary" className="w-full" icon={<RotateCcw size={15} />} onClick={onCreateAnother}>
          Create another check-in
        </Button>
      </div>
      <p className="mt-3 text-center text-xs text-text-muted">Only public blockchain data is shown.</p>
    </div>
  );
}
