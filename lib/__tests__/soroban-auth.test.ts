import { describe, it, expect, vi, beforeEach } from "vitest";
import { Account, Address, Keypair, Networks, xdr } from "@stellar/stellar-sdk";

vi.mock("@/lib/stellar/network", () => ({
  getNetworkConfig: vi.fn(() => ({
    networkPassphrase: Networks.TESTNET,
    horizonUrl: "https://example.com",
  })),
  getServer: vi.fn(),
}));

import { getServer } from "@/lib/stellar/network";
import { authenticateWithSoroban } from "@/lib/stellar/soroban-auth";

function mockServer() {
  const kp = Keypair.random();
  const submitTx = vi.fn().mockResolvedValue({ hash: "auth123", ledger: 55 });
  (getServer as ReturnType<typeof vi.fn>).mockReturnValue({
    loadAccount: vi.fn().mockResolvedValue(new Account(kp.publicKey(), "0")),
    submitTransaction: submitTx,
  });
  return { kp, submitTx };
}

describe("authenticateWithSoroban", () => {
  it("throws with invalid secret key", async () => {
    await expect(
      authenticateWithSoroban({
        sourceSecret: "bad",
        contractId: "CA1234567890123456789012345678901234567890123",
      }),
    ).rejects.toThrow();
  });

  it("builds and submits an authenticated contract invocation", async () => {
    const { kp, submitTx } = mockServer();
    const contractId = Address.contract(Buffer.alloc(32)).toString();

    const hash = await authenticateWithSoroban({
      sourceSecret: kp.secret(),
      contractId,
      network: "testnet",
    });

    expect(hash).toBe("auth123");
    expect(submitTx).toHaveBeenCalledOnce();

    const tx = submitTx.mock.calls[0][0] as { toXDR: (fmt: string) => string };
    const envelope = xdr.TransactionEnvelope.fromXDR(tx.toXDR("base64"), "base64");
    if (envelope.type !== "envelopeTypeTx") throw new Error("expected v1 envelope");
    const ops = envelope.v1.tx.operations;
    expect(ops).toHaveLength(1);
    expect(ops[0].body.type).toBe("invokeHostFunction");
  });
});
