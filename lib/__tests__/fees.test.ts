import { describe, it, expect } from "vitest";
import {
  calculateMinFee,
  calculateMaxFee,
  estimateSorobanFee,
  formatFee,
} from "@/lib/stellar/fees";

describe("Fees", () => {
  describe("calculateMinFee", () => {
    it("calculates base fee for operations", () => {
      expect(calculateMinFee(3)).toBe("300");
    });
  });

  describe("calculateMaxFee", () => {
    it("applies surcharge multiplier", () => {
      expect(calculateMaxFee(2, 5)).toBe("1000");
    });
  });

  describe("estimateSorobanFee", () => {
    it("estimates based on resource usage", () => {
      const fee = estimateSorobanFee(1000, 500, 200);
      expect(BigInt(fee)).toBeGreaterThan(BigInt(0));
    });
  });

  describe("formatFee", () => {
    it("formats stroops as XLM", () => {
      expect(formatFee("10000000")).toBe("1.0000000 XLM");
    });
  });
});
