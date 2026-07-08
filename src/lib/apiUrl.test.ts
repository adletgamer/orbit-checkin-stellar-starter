import { describe, expect, it } from "vitest";
import { apiUrl } from "./apiUrl";

describe("apiUrl", () => {
  it("builds same-origin API paths by default", () => {
    expect(apiUrl("/api/health")).toBe("/api/health");
  });
});
