import { describe, it, expect } from "vitest";
import {
  formatStroops,
  formatLumens,
  shortenKey,
  formatBalance,
  parseAssetString,
} from "@/lib/stellar/format";

describe("formatStroops", () => {
  it("converts lumens to stroops", () => {
    expect(formatStroops("1")).toBe("10000000");
    expect(formatStroops("0.5")).toBe("5000000");
  });
});

describe("formatLumens", () => {
  it("converts stroops to lumens", () => {
    expect(formatLumens("10000000")).toBe("1.0000000");
  });
});

describe("shortenKey", () => {
  it("shortens long keys", () => {
    const key = "GABC1234567890123456789012345678901234567890123456";
    const shortened = shortenKey(key);
    expect(shortened.length).toBeLessThan(key.length);
    expect(shortened).toContain("...");
  });
});

describe("formatBalance", () => {
  it("formats balance with 7 decimals", () => {
    expect(formatBalance("10.5")).toBe("10.5000000");
  });
});

describe("parseAssetString", () => {
  it("parses native XLM", () => {
    expect(parseAssetString("XLM")).toEqual({ code: "XLM" });
  });

  it("parses custom asset", () => {
    expect(parseAssetString("USDC:GA5...")).toEqual({ code: "USDC", issuer: "GA5..." });
  });
});
