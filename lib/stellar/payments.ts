import {
  Keypair,
  TransactionBuilder,
  Operation,
  Asset,
  BASE_FEE,
  Memo,
} from "@stellar/stellar-sdk";
import { getServer, getNetworkConfig, StellarNetwork } from "./network";
import { isValidPublicKey, isValidSecretKey, isValidAmount, isValidMemo } from "./validation";
import { ValidationError, NetworkError, NotFoundError } from "./errors";

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

function validatePaymentInput(params: PaymentParams): void {
  if (!isValidSecretKey(params.sourceSecret)) {
    throw new ValidationError("Invalid source secret key.");
  }
  if (!isValidAmount(params.amount)) {
    throw new ValidationError(`Invalid amount: ${params.amount}.`);
  }
  if (!isValidPublicKey(params.destinationPublicKey)) {
    throw new ValidationError("Invalid destination public key.");
  }
  if (params.memo !== undefined && !isValidMemo(params.memo)) {
    throw new ValidationError("Memo must be at most 28 bytes.");
  }
}

function validateAssetPaymentInput(params: AssetPaymentParams): void {
  validatePaymentInput(params);
  if (!params.assetCode || !new RegExp(/^[A-Za-z0-9]{1,12}$/).test(params.assetCode)) {
    throw new ValidationError(`Invalid asset code: ${params.assetCode}.`);
  }
  if (!isValidPublicKey(params.assetIssuer)) {
    throw new ValidationError("Invalid asset issuer public key.");
  }
}

/**
 * Sends a native XLM payment from one account to another.
 */
export async function sendPayment(params: PaymentParams): Promise<PaymentResult> {
  const { sourceSecret, destinationPublicKey, amount, memo, network = "testnet" } = params;

  validatePaymentInput(params);

  const sourceKeypair = Keypair.fromSecret(sourceSecret);
  const server = getServer(network);
  const { networkPassphrase } = getNetworkConfig(network);

  let sourceAccount;
  try {
    sourceAccount = await server.loadAccount(sourceKeypair.publicKey());
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("not found")) {
      throw new NotFoundError(sourceKeypair.publicKey());
    }
    throw new NetworkError(message);
  }

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

  let result;
  try {
    result = await server.submitTransaction(transaction);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new NetworkError(message, 500);
  }

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

  validateAssetPaymentInput(params);

  const sourceKeypair = Keypair.fromSecret(sourceSecret);
  const server = getServer(network);
  const { networkPassphrase } = getNetworkConfig(network);

  let sourceAccount;
  try {
    sourceAccount = await server.loadAccount(sourceKeypair.publicKey());
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("not found")) {
      throw new NotFoundError(sourceKeypair.publicKey());
    }
    throw new NetworkError(message);
  }

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

  let result;
  try {
    result = await server.submitTransaction(transaction);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new NetworkError(message, 500);
  }

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

  if (!isValidSecretKey(accountSecret)) {
    throw new ValidationError("Invalid account secret key.");
  }
  if (!params.assetCode || !new RegExp(/^[A-Za-z0-9]{1,12}$/).test(params.assetCode)) {
    throw new ValidationError(`Invalid asset code: ${assetCode}.`);
  }
  if (!isValidPublicKey(assetIssuer)) {
    throw new ValidationError("Invalid asset issuer public key.");
  }

  const keypair = Keypair.fromSecret(accountSecret);
  const server = getServer(network);
  const { networkPassphrase } = getNetworkConfig(network);

  let account;
  try {
    account = await server.loadAccount(keypair.publicKey());
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("not found")) {
      throw new NotFoundError(keypair.publicKey());
    }
    throw new NetworkError(message);
  }
  const asset = new Asset(assetCode, assetIssuer);

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(Operation.changeTrust({ asset }))
    .setTimeout(30)
    .build();

  transaction.sign(keypair);

  let result;
  try {
    result = await server.submitTransaction(transaction);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new NetworkError(message, 500);
  }

  return {
    hash: result.hash,
    ledger: result.ledger,
  };
}
