import { Server } from "lucide-react";
import { useState } from "react";
import { useNetworkStatus } from "../../features/network/useNetworkStatus";
import { Tooltip } from "../ui/Tooltip";

function label(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function NetworkStatus() {
  const [open, setOpen] = useState(false);
  const status = useNetworkStatus();

  return (
    <div className="relative">
      <Tooltip label="Network status">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-border-subtle bg-surface-elevated px-3 text-xs font-semibold text-text-secondary transition hover:text-text-primary"
        >
          <Server size={14} />
          Network status
        </button>
      </Tooltip>
      {open ? (
        <div className="absolute right-0 top-11 z-20 w-48 rounded-xl border border-border-subtle bg-surface-elevated p-3 text-xs text-text-secondary shadow-card">
          <p>API: {label(status.api)}</p>
          <p className="mt-1">RPC: {label(status.rpc)}</p>
          <p className="mt-1">Network: Testnet</p>
          <p className="mt-1">Contract: {label(status.contract)}</p>
        </div>
      ) : null}
    </div>
  );
}
