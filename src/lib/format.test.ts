import { describe, expect, it } from "vitest";
import { shortenAddress } from "./format";

describe("shortenAddress", () => {
  it("abbreviates Stellar addresses", () => {
    expect(shortenAddress("GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRSTUVWXYZ2")).toBe("GABC...XYZ2");
  });

  it("keeps short values readable", () => {
    expect(shortenAddress("GABC")).toBe("GABC");
  });
});
