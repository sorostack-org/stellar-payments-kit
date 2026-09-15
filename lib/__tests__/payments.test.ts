import { describe, it, expect, vi } from "vitest";
import { Account, Keypair, Networks } from "@stellar/stellar-sdk";

vi.mock("@/lib/stellar/network", () => ({
  getNetworkConfig: vi.fn(() => ({
    networkPassphrase: Networks.TESTNET,
    horizonUrl: "https://example.com",
  })),
  getServer: vi.fn(),
}));

import { getServer } from "@/lib/stellar/network";
import { sendPayment, sendAssetPayment, addTrustline } from "@/lib/stellar/payments";
import { StellarError, ValidationError, NetworkError, NotFoundError } from "@/lib/stellar/errors";

function mockServer() {
  const kp = Keypair.random();
  const submitTx = vi.fn().mockResolvedValue({
    hash: "payment123",
    ledger: 999,
  });
  const loadAccount = vi.fn().mockResolvedValue(new Account(kp.publicKey(), "0"));
  (getServer as ReturnType<typeof vi.fn>).mockReturnValue({
    loadAccount,
    submitTransaction: submitTx,
  });
  return { kp, submitTx, loadAccount };
}

describe("sendPayment", () => {
  it("throws ValidationError for an invalid source secret", async () => {
    await expect(
      sendPayment({
        sourceSecret: "not-a-secret",
        destinationPublicKey: Keypair.random().publicKey(),
        amount: "10",
      }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("throws ValidationError for an invalid destination public key", async () => {
    const { kp } = mockServer();
    await expect(
      sendPayment({
        sourceSecret: kp.secret(),
        destinationPublicKey: "GABC123",
        amount: "10",
      }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("throws ValidationError for an invalid amount", async () => {
    const { kp } = mockServer();
    await expect(
      sendPayment({
        sourceSecret: kp.secret(),
        destinationPublicKey: Keypair.random().publicKey(),
        amount: "-5",
      }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("throws ValidationError for a memo longer than 28 bytes", async () => {
    const { kp } = mockServer();
    await expect(
      sendPayment({
        sourceSecret: kp.secret(),
        destinationPublicKey: Keypair.random().publicKey(),
        amount: "10",
        memo: "s".repeat(29),
      }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("throws NotFoundError when the source account does not exist", async () => {
    const { kp, loadAccount } = mockServer();
    loadAccount.mockRejectedValue(new Error("Horizon error: account not found"));
    await expect(
      sendPayment({
        sourceSecret: kp.secret(),
        destinationPublicKey: Keypair.random().publicKey(),
        amount: "10",
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("throws NetworkError when Horizon fails to submit", async () => {
    const { kp, submitTx } = mockServer();
    submitTx.mockRejectedValue(new Error("tx bad_seq"));
    await expect(
      sendPayment({
        sourceSecret: kp.secret(),
        destinationPublicKey: Keypair.random().publicKey(),
        amount: "10",
      }),
    ).rejects.toBeInstanceOf(NetworkError);
  });

  it("submits a valid XLM payment", async () => {
    const { kp, submitTx } = mockServer();
    const result = await sendPayment({
      sourceSecret: kp.secret(),
      destinationPublicKey: Keypair.random().publicKey(),
      amount: "10",
    });
    expect(result.hash).toBe("payment123");
    expect(result.ledger).toBe(999);
    expect(submitTx).toHaveBeenCalledTimes(1);
  });
});

describe("sendAssetPayment", () => {
  const issuer = Keypair.random().publicKey();

  it("throws ValidationError for an invalid asset code", async () => {
    const { kp } = mockServer();
    await expect(
      sendAssetPayment({
        sourceSecret: kp.secret(),
        destinationPublicKey: Keypair.random().publicKey(),
        amount: "10",
        assetCode: "TOO-LONG-CODE",
        assetIssuer: issuer,
      }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("throws ValidationError for an invalid asset issuer", async () => {
    const { kp } = mockServer();
    await expect(
      sendAssetPayment({
        sourceSecret: kp.secret(),
        destinationPublicKey: Keypair.random().publicKey(),
        amount: "10",
        assetCode: "USDC",
        assetIssuer: "not-a-key",
      }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("throws ValidationError for an invalid source secret", async () => {
    await expect(
      sendAssetPayment({
        sourceSecret: "nope",
        destinationPublicKey: Keypair.random().publicKey(),
        amount: "10",
        assetCode: "USDC",
        assetIssuer: issuer,
      }),
    ).rejects.toBeInstanceOf(ValidationError);
  });
});

describe("addTrustline", () => {
  it("throws ValidationError for an invalid account secret", async () => {
    await expect(
      addTrustline({
        accountSecret: "bad",
        assetCode: "USDC",
        assetIssuer: Keypair.random().publicKey(),
      }),
    ).rejects.toBeInstanceOf(ValidationError);
  });
});

describe("error hierarchy", () => {
  it("ValidationError and NetworkError extend StellarError", () => {
    expect(ValidationError.prototype).toBeInstanceOf(StellarError);
    expect(NetworkError.prototype).toBeInstanceOf(StellarError);
  });
});
