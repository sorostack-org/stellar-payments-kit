import { Keypair, TransactionBuilder, Transaction, FeeBumpTransaction } from "@stellar/stellar-sdk";
import { getServer, getNetworkConfig, StellarNetwork } from "./network";

export interface FeeBumpParams {
  /** Secret key of the account paying the fee */
  feeSourceSecret: string;
  /** XDR-encoded inner transaction */
  innerTransactionXdr: string;
  /** Fee per operation in stroops (default: 200) */
  baseFee?: string;
  network?: StellarNetwork;
}

export interface FeeBumpResult {
  hash: string;
  ledger: number;
  innerHash: string;
}

/**
 * Wraps an existing signed transaction in a fee-bump transaction,
 * allowing a sponsor account to pay the transaction fee on behalf of the user.
 */
export async function buildFeeBumpTransaction(params: FeeBumpParams): Promise<FeeBumpResult> {
  const { feeSourceSecret, innerTransactionXdr, baseFee = "200", network = "testnet" } = params;

  const feeKeypair = Keypair.fromSecret(feeSourceSecret);
  const server = getServer(network);
  const { networkPassphrase } = getNetworkConfig(network);

  const innerTx = TransactionBuilder.fromXDR(innerTransactionXdr, networkPassphrase) as Transaction;

  const feeBumpTx = TransactionBuilder.buildFeeBumpTransaction(
    feeKeypair,
    baseFee,
    innerTx,
    networkPassphrase,
  );

  feeBumpTx.sign(feeKeypair);

  const result = await server.submitTransaction(feeBumpTx);

  return {
    hash: result.hash,
    ledger: result.ledger,
    innerHash: innerTx.hash().toString("hex"),
  };
}

/**
 * Decodes a transaction XDR string and returns a human-readable summary.
 */
export function decodeTransactionXdr(
  xdr: string,
  network: StellarNetwork = "testnet",
): {
  sourceAccount: string;
  fee: string;
  operationCount: number;
  operations: { type: string }[];
  memo: string;
} {
  const { networkPassphrase } = getNetworkConfig(network);
  const tx = TransactionBuilder.fromXDR(xdr, networkPassphrase);

  const isFeeBump = tx instanceof FeeBumpTransaction;

  /** Safely extract a human-readable memo string */
  function memoText(memo: Transaction["memo"]): string {
    if (!memo || memo.type === "none") return "";
    const v = memo.value;
    if (v === null || v === undefined) return "";
    if (Buffer.isBuffer(v)) return v.toString("utf8");
    return String(v);
  }

  if (isFeeBump) {
    const inner = tx.innerTransaction;
    return {
      sourceAccount: tx.feeSource,
      fee: tx.fee,
      operationCount: inner.operations.length,
      operations: inner.operations.map((op) => ({ type: op.type })),
      memo: memoText(inner.memo),
    };
  }

  const plainTx = tx as Transaction;
  return {
    sourceAccount: plainTx.source,
    fee: plainTx.fee,
    operationCount: plainTx.operations.length,
    operations: plainTx.operations.map((op) => ({ type: op.type })),
    memo: memoText(plainTx.memo),
  };
}

/**
 * Returns the transaction detail URL on Stellar Expert for the given hash.
 */
export function getExplorerUrl(hash: string, network: StellarNetwork = "testnet"): string {
  const net = network === "testnet" ? "testnet" : "public";
  return `https://stellar.expert/explorer/${net}/tx/${hash}`;
}
