import { describe, it, expect } from "vitest";
import { validateNFTMetadata, formatNFTIdentifier, parseNFTIdentifier } from "@/lib/stellar/nft";

describe("NFT", () => {
  describe("validateNFTMetadata", () => {
    it("validates correct metadata", () => {
      expect(
        validateNFTMetadata({
          name: "Test",
          description: "Desc",
          image: "https://example.com/img.png",
        }),
      ).toBe(true);
    });

    it("rejects empty name", () => {
      expect(
        validateNFTMetadata({
          name: "",
          description: "Desc",
          image: "https://example.com/img.png",
        }),
      ).toBe(false);
    });
  });

  describe("formatNFTIdentifier", () => {
    it("formats correctly", () => {
      expect(formatNFTIdentifier("CA123", "1")).toBe("CA123:1");
    });
  });

  describe("parseNFTIdentifier", () => {
    it("parses correctly", () => {
      const result = parseNFTIdentifier("CA123:1");
      expect(result.contractId).toBe("CA123");
      expect(result.tokenId).toBe("1");
    });
  });
});
