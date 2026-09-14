import { describe, it, expect } from "vitest";
import {
  createContractInstance,
  formatContractCall,
  parseContractError,
} from "@/lib/stellar/soroban-contract";

describe("SorobanContract", () => {
  describe("createContractInstance", () => {
    it("creates contract instance", () => {
      const contract = createContractInstance(
        "CA123",
        "testnet",
        "https://rpc.testnet.stellar.org",
      );
      expect(contract.contractId).toBe("CA123");
      expect(contract.networkPassphrase).toBe("testnet");
    });
  });

  describe("formatContractCall", () => {
    it("formats call string", () => {
      const result = formatContractCall("CA123", "balance", ["GABC"]);
      expect(result).toContain("CA123");
      expect(result).toContain("balance");
    });
  });

  describe("parseContractError", () => {
    it("parses known error codes", () => {
      const result = parseContractError("Error(ContractError(2))");
      expect(result.code).toBe("INVALID_INPUT");
    });

    it("parses unknown error codes", () => {
      const result = parseContractError("Error(ContractError(99))");
      expect(result.code).toBe("UNKNOWN");
    });

    it("handles unknown string", () => {
      const result = parseContractError("Something went wrong");
      expect(result.code).toBe("UNKNOWN");
    });
  });
});
