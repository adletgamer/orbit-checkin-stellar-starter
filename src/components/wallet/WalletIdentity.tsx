import { Wallet2 } from "lucide-react";
import { mockData } from "../../features/demo/demoStates";
import { shortenAddress } from "../../lib/format";
import { CopyButton } from "../ui/CopyButton";

export function WalletIdentity({
  connected,
  loading,
  address,
  onConnect,
  onCopy,
}: {
  connected: boolean;
  loading?: boolean;
  address?: string;
  onConnect: () => void;
  onCopy: (message: string) => void;
}) {
  const walletAddress = address || mockData.walletAddress;

  if (loading) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-border-subtle bg-surface-elevated/70 p-4">
        <div>
          <div className="h-4 w-36 animate-pulse rounded bg-surface-soft" />
          <div className="mt-2 h-3 w-28 animate-pulse rounded bg-surface-soft" />
        </div>
        <div className="h-9 w-9 animate-pulse rounded-lg bg-surface-soft" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border-subtle bg-surface-elevated/70 p-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          {connected ? (
            <span className="h-2.5 w-2.5 rounded-full bg-success" aria-hidden="true" />
          ) : (
            <Wallet2 size={16} className="text-text-muted" aria-hidden="true" />
          )}
          {connected ? shortenAddress(walletAddress) : "Wallet not connected"}
        </div>
        <p className="mt-1 truncate text-xs text-text-muted">
          {connected ? "Connected with Freighter" : "Connect Freighter"}
        </p>
      </div>
      {connected ? (
        <CopyButton value={walletAddress} label="Wallet address" onCopy={onCopy} />
      ) : (
        <button
          type="button"
          onClick={onConnect}
          className="rounded-lg px-2 py-1 text-sm font-semibold text-primary transition hover:text-primary-hover"
        >
          Connect
        </button>
      )}
    </div>
  );
}
