import { describe, expect, it } from "vitest";
import { isTransactionActive, transactionSteps } from "./transactionMachine";

describe("transaction machine", () => {
  it("maps awaiting signature to the Sign step", () => {
    expect(transactionSteps({ status: "awaiting_signature" })).toEqual({
      prepare: "complete",
      sign: "active",
      confirm: "pending",
    });
  });

  it("marks rejected signatures as Sign errors", () => {
    expect(transactionSteps({ status: "rejected" }).sign).toBe("error");
  });

  it("detects active states", () => {
    expect(isTransactionActive({ status: "confirming" })).toBe(true);
    expect(isTransactionActive({ status: "idle" })).toBe(false);
  });
});
