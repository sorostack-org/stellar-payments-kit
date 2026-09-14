import { describe, it, expect } from "vitest";
import {
  createProposal,
  castVote,
  getWinningOption,
  isProposalActive,
} from "@/lib/stellar/governance";

describe("Governance", () => {
  describe("createProposal", () => {
    it("creates a proposal with correct structure", () => {
      const p = createProposal("Test", "Desc", ["Yes", "No"], 86400000, 100);
      expect(p.title).toBe("Test");
      expect(p.options).toEqual(["Yes", "No"]);
      expect(p.executed).toBe(false);
    });
  });

  describe("castVote", () => {
    it("throws for invalid option", () => {
      const p = createProposal("Test", "Desc", ["A", "B"], 86400000, 100);
      expect(() => castVote(p, "C", 1)).toThrow("Invalid option");
    });
  });

  describe("getWinningOption", () => {
    it("returns null below quorum", () => {
      const p = createProposal("Test", "Desc", ["A", "B"], 86400000, 100);
      expect(getWinningOption(p)).toBeNull();
    });
  });

  describe("isProposalActive", () => {
    it("returns false for expired proposal", () => {
      const p = createProposal("Test", "Desc", ["A", "B"], -1, 100);
      expect(isProposalActive(p)).toBe(false);
    });
  });
});
