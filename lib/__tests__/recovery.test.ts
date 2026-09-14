import { describe, it, expect } from "vitest";
import { splitSecret, validateRecoveryConfig } from "@/lib/stellar/recovery";
import { generateKeypair } from "@/lib/stellar/accounts";

describe("splitSecret", () => {
  it("splits secret into shares", () => {
    const { secretKey } = generateKeypair();
    const shares = splitSecret(secretKey, 3);
    expect(shares).toHaveLength(3);
  });
});

describe("validateRecoveryConfig", () => {
  it("validates correct config", () => {
    expect(
      validateRecoveryConfig({
        m: 2,
        n: 3,
        guardians: ["a", "b", "c"],
      }),
    ).toBe(true);
  });

  it("rejects invalid config", () => {
    expect(
      validateRecoveryConfig({
        m: 4,
        n: 3,
        guardians: ["a", "b", "c"],
      }),
    ).toBe(false);
  });
});
