import { useEffect, useState } from "react";
import { getNetworkStatus, type NetworkStatus } from "./network.service";

const checking: NetworkStatus = {
  api: "checking",
  rpc: "checking",
  network: "testnet",
  contract: "checking",
};

export function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus>(checking);

  useEffect(() => {
    let cancelled = false;
    let timer: number | null = null;

    async function refresh() {
      if (document.visibilityState !== "visible") return;

      const next = await getNetworkStatus().catch(() => ({
        api: "offline" as const,
        rpc: "offline" as const,
        network: "testnet" as const,
        contract: "offline" as const,
      }));

      if (!cancelled) setStatus(next);
    }

    refresh();
    timer = window.setInterval(refresh, 30_000);

    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
    };
  }, []);

  return status;
}
