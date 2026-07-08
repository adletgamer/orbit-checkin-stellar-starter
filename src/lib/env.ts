import { z } from "zod";

const contractIdSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || /^C[A-Z2-7]{55}$/.test(value), {
    message: "Contract ID must be a Stellar contract address.",
  });

const optionalUrlSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || z.string().url().safeParse(value).success, {
    message: "Value must be empty or a valid URL.",
  });

export const clientEnvSchema = z.object({
  VITE_APP_MODE: z.enum(["demo", "testnet"]).default("demo"),
  VITE_STELLAR_NETWORK: z.literal("testnet").default("testnet"),
  VITE_STELLAR_RPC_URL: z.string().url().default("https://soroban-testnet.stellar.org"),
  VITE_CONTRACT_ID: contractIdSchema.default(""),
  VITE_API_URL: optionalUrlSchema.default(""),
  VITE_STELLAR_LAB_URL: z.string().url().default("https://stellar.expert/explorer"),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

export function parseClientEnv(source: Record<string, unknown>) {
  return clientEnvSchema.parse(source);
}

export const env = parseClientEnv(import.meta.env);

export function isTestnetConfigured(config = env) {
  return config.VITE_APP_MODE === "testnet" && config.VITE_CONTRACT_ID.length > 0;
}
