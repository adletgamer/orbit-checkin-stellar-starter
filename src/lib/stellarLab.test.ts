import { describe, expect, it } from "vitest";
import { contractLabUrl, transactionLabUrl } from "./stellarLab";

describe("stellarLab links", () => {
  it("builds a Testnet transaction link", () => {
    expect(transactionLabUrl("abc123", "https://lab.stellar.org")).toBe(
      "https://stellar.expert/explorer/testnet/tx/abc123",
    );
  });

  it("builds a Testnet contract link", () => {
    expect(contractLabUrl("CCONTRACT", "https://lab.stellar.org")).toBe(
      "https://stellar.expert/explorer/testnet/contract/CCONTRACT",
    );
  });
});
