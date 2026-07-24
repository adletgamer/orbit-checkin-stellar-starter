import { z } from "zod";

const contractIdSchema = z
  .string()
  .trim()
  .default("")
  .refine((value) => value === "" || /^C[A-Z2-7]{55}$/.test(value), {
    message: "Contract ID must be a Stellar contract address.",
  });

const vercelApiEnvSchema = z.object({
  API_STELLAR_NETWORK: z.literal("testnet").default("testnet"),
  API_STELLAR_RPC_URL: z.string().url().default("https://soroban-testnet.stellar.org"),
  API_CONTRACT_ID: contractIdSchema,
});

export const vercelApiEnv = vercelApiEnvSchema.parse(process.env);

export type JsonResponse = {
  setHeader(name: string, value: string): void;
  status(code: number): JsonResponse;
  json(value: unknown): void;
};

export function sendJson(res: JsonResponse, statusCode: number, value: unknown) {
  res.setHeader("Cache-Control", "s-maxage=15, stale-while-revalidate=30");
  res.status(statusCode).json(value);
}

export function sendError(res: JsonResponse, statusCode = 500) {
  res.setHeader("Cache-Control", "no-store");
  res.status(statusCode).json({
    error: {
      code: "api_error",
      message: "The API could not complete the request.",
    },
  });
}
