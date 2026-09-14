import { describe, it, expect } from "vitest";
import { calculateSwapOutput, calculatePoolShare, calculateLpTokens } from "@/lib/stellar/amm";

describe("AMM", () => {
  describe("calculateSwapOutput", () => {
    it("returns correct output for a swap", () => {
      const result = calculateSwapOutput("100", "1000", "2000", 30);
      expect(BigInt(result)).toBeGreaterThan(BigInt(0));
      expect(BigInt(result)).toBeLessThan(BigInt(2000));
    });

    it("returns full output reserve when input reserve is zero", () => {
      expect(calculateSwapOutput("100", "0", "2000", 30)).toBe("2000");
    });
  });

  describe("calculatePoolShare", () => {
    it("returns correct share ratio", () => {
      expect(calculatePoolShare("100", "1000")).toBeCloseTo(0.1, 5);
    });

    it("returns 0 for zero total liquidity", () => {
      expect(calculatePoolShare("100", "0")).toBe(0);
    });
  });

  describe("calculateLpTokens", () => {
    it("returns positive token amount", () => {
      const result = calculateLpTokens("100", "200", "0", "0", "0");
      expect(Number(result)).toBeGreaterThan(0);
    });
  });
});
