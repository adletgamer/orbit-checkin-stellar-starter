import { Networks, StrKey, rpc } from "@stellar/stellar-sdk";
import { env } from "./env";

export const TESTNET_PASSPHRASE = Networks.TESTNET;

export function assertContractId(contractId: string) {
  if (!StrKey.isValidContract(contractId)) {
    throw new Error("Invalid contract ID");
  }
}

export function createRpcServer(rpcUrl = env.VITE_STELLAR_RPC_URL) {
  return new rpc.Server(rpcUrl, {
    allowHttp: rpcUrl.startsWith("http://"),
    timeout: 15_000,
  });
}
