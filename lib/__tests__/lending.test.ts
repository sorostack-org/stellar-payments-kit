import { describe, it, expect } from "vitest";
import {
  calculateHealthFactor,
  calculateLiquidationPrice,
  isLiquidatable,
} from "@/lib/stellar/lending";

describe("Lending", () => {
  describe("calculateHealthFactor", () => {
    it("returns infinity for zero debt", () => {
      expect(calculateHealthFactor("1000", "0")).toBe("infinity");
    });

    it("returns correct health factor", () => {
      const hf = Number(calculateHealthFactor("1000", "500", 0.8));
      expect(hf).toBeCloseTo(1.6, 5);
    });
  });

  describe("calculateLiquidationPrice", () => {
    it("returns 0 for zero collateral", () => {
      expect(calculateLiquidationPrice("500", "0")).toBe("0");
    });
  });

  describe("isLiquidatable", () => {
    it("returns true when health factor < 1", () => {
      expect(isLiquidatable("0.5")).toBe(true);
    });

    it("returns false for infinity", () => {
      expect(isLiquidatable("infinity")).toBe(false);
    });
  });
});
