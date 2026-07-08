import { describe, expect, it } from "vitest";
import { shortenAddress } from "./format";

describe("shortenAddress", () => {
  it("abbreviates Stellar addresses", () => {
    expect(shortenAddress("GDGZXTW36RZPHO3XL2SCCRCYJORJAF2S6TE3IY27X4ZDWVRWLH4XIIFD")).toBe("GDGZ...IIFD");
  });

  it("keeps short values readable", () => {
    expect(shortenAddress("GABC")).toBe("GABC");
  });
});
