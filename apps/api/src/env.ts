import { z } from "zod";

const apiEnvSchema = z.object({
  API_PORT: z.coerce.number().int().positive().default(3001),
  API_ALLOWED_ORIGIN: z.string().default("http://127.0.0.1:5173,http://127.0.0.1:5174"),
  API_STELLAR_NETWORK: z.literal("testnet").default("testnet"),
  API_STELLAR_RPC_URL: z.string().url().default("https://soroban-testnet.stellar.org"),
  API_CONTRACT_ID: z
    .string()
    .trim()
    .default("")
    .refine((value) => value === "" || /^C[A-Z2-7]{55}$/.test(value), {
      message: "API_CONTRACT_ID must be a Stellar contract address.",
    }),
});

export type ApiEnv = z.infer<typeof apiEnvSchema>;

export function parseApiEnv(source: NodeJS.ProcessEnv) {
  return apiEnvSchema.parse(source);
}

export const apiEnv = parseApiEnv(process.env);

export function allowedOrigins() {
  return apiEnv.API_ALLOWED_ORIGIN.split(",").map((origin) => origin.trim());
}
