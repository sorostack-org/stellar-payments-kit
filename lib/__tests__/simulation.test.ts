import { describe, it, expect } from "vitest";
import {
  createSimulation,
  estimateFeeFromOperations,
  validateSimulationResult,
} from "@/lib/stellar/simulation";

describe("Simulation", () => {
  describe("createSimulation", () => {
    it("creates simulation result", () => {
      const result = createSimulation([{ type: "payment", source: "GABC" }], "200");
      expect(result.success).toBe(true);
      expect(result.operations).toHaveLength(1);
      expect(result.fee).toBe("200");
    });
  });

  describe("estimateFeeFromOperations", () => {
    it("calculates total fee", () => {
      expect(estimateFeeFromOperations(3, "100")).toBe("300");
    });
  });

  describe("validateSimulationResult", () => {
    it("validates correct result", () => {
      const result = createSimulation([{ type: "payment", source: "GABC" }]);
      expect(validateSimulationResult(result)).toBe(true);
    });
  });
});
