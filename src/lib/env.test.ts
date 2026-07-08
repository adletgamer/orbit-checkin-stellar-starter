import { describe, expect, it } from "vitest";
import { parseClientEnv } from "./env";

describe("client env", () => {
  it("defaults to demo Testnet", () => {
    const env = parseClientEnv({});
    expect(env.VITE_APP_MODE).toBe("demo");
    expect(env.VITE_STELLAR_NETWORK).toBe("testnet");
    expect(env.VITE_API_URL).toBe("");
  });

  it("rejects invalid app modes", () => {
    expect(() => parseClientEnv({ VITE_APP_MODE: "mainnet" })).toThrow();
  });

  it("accepts an empty API URL for same-origin Vercel functions", () => {
    expect(parseClientEnv({ VITE_API_URL: "" }).VITE_API_URL).toBe("");
  });
});
