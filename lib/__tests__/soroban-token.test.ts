import { describe, it, expect } from "vitest";
import {
  parseSorobanTokenResponse,
  formatTokenAmount,
  parseTokenAmount,
} from "@/lib/stellar/soroban-token";

describe("SorobanToken", () => {
  describe("parseSorobanTokenResponse", () => {
    it("parses token info", () => {
      const info = parseSorobanTokenResponse(
        JSON.stringify({ name: "Test", symbol: "TST", decimals: 7, total_supply: "1000" }),
        "CA123",
      );
      expect(info.name).toBe("Test");
      expect(info.contractId).toBe("CA123");
    });
  });

  describe("formatTokenAmount", () => {
    it("formats with decimals", () => {
      expect(formatTokenAmount("1000000", 7)).toBe("0.1000000");
    });
  });

  describe("parseTokenAmount", () => {
    it("parses formatted amount", () => {
      expect(parseTokenAmount("0.1000000", 7)).toBe("1000000");
    });
  });
});
