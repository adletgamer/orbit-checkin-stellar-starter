import { Eye, EyeOff, Wallet2 } from "lucide-react";
import { useState } from "react";
import { shortenAddress } from "../../lib/format";

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
  const walletAddress = address?.trim();
  const [revealed, setRevealed] = useState(false);

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
          {connected
            ? walletAddress
              ? revealed
                ? shortenAddress(walletAddress, 8, 6)
                : "Wallet connected"
              : "Demo wallet"
            : "Wallet not connected"}
        </div>
        <p className="mt-1 truncate text-xs text-text-muted">
          {connected
            ? walletAddress
              ? revealed
                ? "Public address visible"
                : "Address hidden for privacy"
              : "Private simulated session"
            : "Connect Freighter"}
        </p>
      </div>
      {connected && walletAddress ? (
        <button
          type="button"
          onClick={() => setRevealed((value) => !value)}
          aria-pressed={revealed}
          className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-border-subtle px-3 text-xs font-semibold text-text-secondary transition hover:border-border-strong hover:text-text-primary"
        >
          {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
          {revealed ? "Hide" : "Reveal"}
        </button>
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
