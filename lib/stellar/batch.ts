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

export interface BatchPayment {
  destinationPublicKey: string;
  amount: string;
}

export interface BatchPaymentParams {
  sourceSecret: string;
  payments: BatchPayment[];
  assetCode?: string;
  assetIssuer?: string;
  memo?: string;
  network?: StellarNetwork;
}

export interface BatchPaymentResult {
  hash: string;
  ledger: number;
  paymentCount: number;
}

export async function sendBatchPayment(params: BatchPaymentParams): Promise<BatchPaymentResult> {
  const { sourceSecret, payments, assetCode, assetIssuer, memo, network = "testnet" } = params;

  if (payments.length === 0) {
    throw new ValidationError("sendBatchPayment requires at least one payment.");
  }

  if (!isValidSecretKey(sourceSecret)) {
    throw new ValidationError("Invalid source secret key.");
  }
  if (memo !== undefined && !isValidMemo(memo)) {
    throw new ValidationError("Memo must be at most 28 bytes.");
  }

  for (let i = 0; i < payments.length; i++) {
    const payment = payments[i];
    if (!isValidPublicKey(payment.destinationPublicKey)) {
      throw new ValidationError(`Invalid destination public key at index ${i}.`);
    }
    if (!isValidAmount(payment.amount)) {
      throw new ValidationError(`Invalid amount at index ${i}: ${payment.amount}.`);
    }
  }

  if (assetCode !== undefined && assetIssuer !== undefined) {
    if (!isValidPublicKey(assetIssuer)) {
      throw new ValidationError("Invalid asset issuer public key.");
    }
  }

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

  const asset = assetCode && assetIssuer ? new Asset(assetCode, assetIssuer) : Asset.native();

  const builder = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase,
  });

  if (memo) {
    builder.addMemo(Memo.text(memo));
  }

  for (const payment of payments) {
    builder.addOperation(
      Operation.payment({
        destination: payment.destinationPublicKey,
        asset,
        amount: payment.amount,
      }),
    );
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
    paymentCount: payments.length,
  };
}
