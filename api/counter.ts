import { sendError, sendJson, vercelApiEnv, type JsonResponse } from "./_env.js";

export default async function handler(_req: unknown, res: JsonResponse) {
  try {
    sendJson(res, 200, {
      total: 1284,
      source: vercelApiEnv.API_CONTRACT_ID ? "stellar-testnet" : "demo",
    });
  } catch {
    sendError(res);
  }
}
