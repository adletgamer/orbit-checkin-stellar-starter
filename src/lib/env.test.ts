import { describe, expect, it } from "vitest";
import { parseClientEnv } from "./env";

describe("client env", () => {
  it("defaults to demo Testnet", () => {
    const env = parseClientEnv({});
    expect(env.VITE_APP_MODE).toBe("demo");
    expect(env.VITE_STELLAR_NETWORK).toBe("testnet");
  });

  it("rejects invalid app modes", () => {
    expect(() => parseClientEnv({ VITE_APP_MODE: "mainnet" })).toThrow();
  });
});
