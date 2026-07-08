import { rpc } from "@stellar/stellar-sdk";
import { sendError, sendJson, vercelApiEnv, type JsonResponse } from "./_env.js";

export default async function handler(_req: unknown, res: JsonResponse) {
  try {
    let rpcConfigured = Boolean(vercelApiEnv.API_STELLAR_RPC_URL);

    try {
      const server = new rpc.Server(vercelApiEnv.API_STELLAR_RPC_URL, {
        allowHttp: vercelApiEnv.API_STELLAR_RPC_URL.startsWith("http://"),
        timeout: 5_000,
      });
      await server.getHealth();
    } catch {
      rpcConfigured = false;
    }

    sendJson(res, 200, {
      network: "testnet",
      contractId: vercelApiEnv.API_CONTRACT_ID,
      rpcConfigured,
    });
  } catch {
    sendError(res);
  }
}
