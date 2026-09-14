import {
  Keypair,
  TransactionBuilder,
  Operation,
  Asset,
  BASE_FEE,
  Memo,
} from "@stellar/stellar-sdk";
import { getServer, getNetworkConfig, StellarNetwork } from "./network";

export interface PaymentParams {
  /** Secret key of the sending account */
  sourceSecret: string;
  /** Public key of the recipient */
  destinationPublicKey: string;
  /** Amount to send (as a string, e.g. "10.5") */
  amount: string;
  /** Optional memo text (max 28 bytes) */
  memo?: string;
  network?: StellarNetwork;
}

export interface AssetPaymentParams extends PaymentParams {
  /** Asset code, e.g. "USDC" */
  assetCode: string;
  /** Public key of the asset issuer */
  assetIssuer: string;
}

export interface PaymentResult {
  /** Transaction hash */
  hash: string;
  /** Ledger the transaction was included in */
  ledger: number;
}

/**
 * Sends a native XLM payment from one account to another.
 */
export async function sendPayment(params: PaymentParams): Promise<PaymentResult> {
  const { sourceSecret, destinationPublicKey, amount, memo, network = "testnet" } = params;

  const sourceKeypair = Keypair.fromSecret(sourceSecret);
  const server = getServer(network);
  const { networkPassphrase } = getNetworkConfig(network);

  const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

  const builder = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase,
  }).addOperation(
    Operation.payment({
      destination: destinationPublicKey,
      asset: Asset.native(),
      amount,
    }),
  );

  if (memo) {
    builder.addMemo(Memo.text(memo));
  }

  const transaction = builder.setTimeout(30).build();
  transaction.sign(sourceKeypair);

  const result = await server.submitTransaction(transaction);

  return {
    hash: result.hash,
    ledger: result.ledger,
  };
}

/**
 * Sends a custom asset payment from one account to another.
 * The destination must have a trustline for the asset.
 */
export async function sendAssetPayment(params: AssetPaymentParams): Promise<PaymentResult> {
  const {
    sourceSecret,
    destinationPublicKey,
    amount,
    assetCode,
    assetIssuer,
    memo,
    network = "testnet",
  } = params;

  const sourceKeypair = Keypair.fromSecret(sourceSecret);
  const server = getServer(network);
  const { networkPassphrase } = getNetworkConfig(network);

  const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());
  const asset = new Asset(assetCode, assetIssuer);

  const builder = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase,
  }).addOperation(
    Operation.payment({
      destination: destinationPublicKey,
      asset,
      amount,
    }),
  );

  if (memo) {
    builder.addMemo(Memo.text(memo));
  }

  const transaction = builder.setTimeout(30).build();
  transaction.sign(sourceKeypair);

  const result = await server.submitTransaction(transaction);

  return {
    hash: result.hash,
    ledger: result.ledger,
  };
}

/**
 * Establishes a trustline for a custom asset on an account.
 * Must be called before receiving a non-native asset.
 */
export async function addTrustline(params: {
  accountSecret: string;
  assetCode: string;
  assetIssuer: string;
  network?: StellarNetwork;
}): Promise<PaymentResult> {
  const { accountSecret, assetCode, assetIssuer, network = "testnet" } = params;

  const keypair = Keypair.fromSecret(accountSecret);
  const server = getServer(network);
  const { networkPassphrase } = getNetworkConfig(network);

  const account = await server.loadAccount(keypair.publicKey());
  const asset = new Asset(assetCode, assetIssuer);

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(Operation.changeTrust({ asset }))
    .setTimeout(30)
    .build();

  transaction.sign(keypair);

  const result = await server.submitTransaction(transaction);

  return {
    hash: result.hash,
    ledger: result.ledger,
  };
}
