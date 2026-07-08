import { env } from "./env";

const STELLAR_EXPERT_EXPLORER_URL = "https://stellar.expert/explorer";

export function transactionLabUrl(hash: string, baseUrl = env.VITE_STELLAR_LAB_URL) {
  const explorerUrl = baseUrl.includes("lab.stellar.org") ? STELLAR_EXPERT_EXPLORER_URL : baseUrl;
  return `${explorerUrl.replace(/\/$/, "")}/testnet/tx/${encodeURIComponent(hash)}`;
}

export function contractLabUrl(contractId: string, baseUrl = env.VITE_STELLAR_LAB_URL) {
  const explorerUrl = baseUrl.includes("lab.stellar.org") ? STELLAR_EXPERT_EXPLORER_URL : baseUrl;
  return `${explorerUrl.replace(/\/$/, "")}/testnet/contract/${encodeURIComponent(contractId)}`;
}
