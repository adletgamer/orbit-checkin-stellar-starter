import { describe, expect, it } from "vitest";
import { parseError } from "./errorParser";

describe("parseError", () => {
  it("sanitizes rejected signatures", () => {
    const error = parseError(new Error("User rejected request"));
    expect(error.title).toBe("Signature cancelled");
  });

  it("sanitizes rpc failures", () => {
    const error = parseError(new Error("RPC failed to fetch"));
    expect(error.title).toBe("Testnet is not responding");
  });
});
