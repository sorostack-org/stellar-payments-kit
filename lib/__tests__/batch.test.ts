import { describe, it, expect, vi } from "vitest";
import { Account, Keypair, Networks, xdr } from "@stellar/stellar-sdk";

vi.mock("@/lib/stellar/network", () => ({
  getNetworkConfig: vi.fn(() => ({
    networkPassphrase: Networks.TESTNET,
    horizonUrl: "https://example.com",
  })),
  getServer: vi.fn(),
}));

import { getServer } from "@/lib/stellar/network";
import { sendBatchPayment } from "@/lib/stellar/batch";

function mockServer() {
  const kp = Keypair.random();
  const submitTx = vi.fn().mockResolvedValue({
    hash: "batch123",
    ledger: 100,
  });
  (getServer as ReturnType<typeof vi.fn>).mockReturnValue({
    loadAccount: vi.fn().mockResolvedValue(new Account(kp.publicKey(), "0")),
    submitTransaction: submitTx,
  });
  return { kp, submitTx };
}

function operationsOf(submitTx: ReturnType<typeof vi.fn>) {
  const tx = submitTx.mock.calls[0][0] as { toXDR: (fmt: string) => string };
  return xdr.TransactionEnvelope.fromXDR(tx.toXDR("base64"), "base64").v1().tx().operations();
}

describe("sendBatchPayment", () => {
  it("throws with invalid secret key", async () => {
    await expect(
      sendBatchPayment({
        sourceSecret: "invalid",
        payments: [
          {
            destinationPublicKey: "GABC1234567890123456789012345678901234567890123",
            amount: "10",
          },
        ],
      }),
    ).rejects.toThrow();
  });

  it("rejects empty payments array", async () => {
    const { kp } = mockServer();
    await expect(sendBatchPayment({ sourceSecret: kp.secret(), payments: [] })).rejects.toThrow(
      "at least one",
    );
  });

  it("submits one payment operation per entry", async () => {
    const { kp, submitTx } = mockServer();

    const result = await sendBatchPayment({
      sourceSecret: kp.secret(),
      payments: [
        { destinationPublicKey: Keypair.random().publicKey(), amount: "10" },
        { destinationPublicKey: Keypair.random().publicKey(), amount: "20" },
        { destinationPublicKey: Keypair.random().publicKey(), amount: "30" },
      ],
      network: "testnet",
    });

    expect(result.hash).toBe("batch123");
    expect(result.paymentCount).toBe(3);
    expect(result.ledger).toBe(100);

    const ops = operationsOf(submitTx);
    expect(ops).toHaveLength(3);
    for (const op of ops) {
      expect(op.body().switch().name).toBe("payment");
    }
  });

  it("attaches a single memo when provided", async () => {
    const { kp, submitTx } = mockServer();

    await sendBatchPayment({
      sourceSecret: kp.secret(),
      payments: [{ destinationPublicKey: Keypair.random().publicKey(), amount: "5" }],
      memo: "payout",
      network: "testnet",
    });

    const tx = submitTx.mock.calls[0][0] as { memo: { _type: string; value: string } };
    expect(tx.memo._type).toBe("text");
    expect(tx.memo.value).toBe("payout");
  });
});
