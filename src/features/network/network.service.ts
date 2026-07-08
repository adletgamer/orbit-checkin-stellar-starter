import { env } from "../../lib/env";

export type NetworkStatusValue = "online" | "degraded" | "offline" | "checking";

export type NetworkStatus = {
  api: NetworkStatusValue;
  rpc: NetworkStatusValue;
  network: "testnet";
  contract: NetworkStatusValue;
};

export async function getNetworkStatus(): Promise<NetworkStatus> {
  const response = await fetch(`${env.VITE_API_URL}/api/network`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    return {
      api: "offline",
      rpc: "offline",
      network: "testnet",
      contract: "offline",
    };
  }

  const payload = (await response.json()) as {
    rpcConfigured: boolean;
    contractId: string;
  };

  return {
    api: "online",
    rpc: payload.rpcConfigured ? "online" : "degraded",
    network: "testnet",
    contract: payload.contractId ? "online" : "degraded",
  };
}
