import { describe, it, expect } from "vitest";
import {
  sanitizePublicKey,
  sanitizeAmount,
  sanitizeMemo,
  sanitizeAssetCode,
  sanitizeDomain,
} from "@/lib/stellar/sanitize";

describe("sanitize", () => {
  describe("sanitizePublicKey", () => {
    it("trims and uppercases", () => {
      expect(sanitizePublicKey("  gabc123  ")).toBe("GABC123");
    });
  });

  describe("sanitizeAmount", () => {
    it("removes invalid chars", () => {
      expect(sanitizeAmount("  $100.50abc ")).toBe("100.50");
    });
  });

  describe("sanitizeMemo", () => {
    it("truncates long memos", () => {
      expect(sanitizeMemo("a".repeat(50), 10)).toBe("a".repeat(10));
    });
  });

  describe("sanitizeAssetCode", () => {
    it("cleans and uppercases", () => {
      expect(sanitizeAssetCode(" usd_coin! ")).toBe("USDCOIN");
    });
  });

  describe("sanitizeDomain", () => {
    it("strips protocol", () => {
      expect(sanitizeDomain("https://example.com/path")).toBe("example.com");
    });
  });
});
