import { Keypair, TransactionBuilder, Operation, BASE_FEE } from "@stellar/stellar-sdk";
import { getServer, getNetworkConfig, StellarNetwork } from "./network";

export interface AddSignerParams {
  sourceSecret: string;
  signerPublicKey: string;
  weight: number;
  network?: StellarNetwork;
}

export async function addSigner(params: AddSignerParams): Promise<string> {
  const { sourceSecret, signerPublicKey, weight, network = "testnet" } = params;

  const sourceKeypair = Keypair.fromSecret(sourceSecret);
  const server = getServer(network);
  const { networkPassphrase } = getNetworkConfig(network);
  const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(
      Operation.setOptions({
        signer: {
          ed25519PublicKey: signerPublicKey,
          weight,
        },
      }),
    )
    .setTimeout(30)
    .build();

  transaction.sign(sourceKeypair);
  const result = await server.submitTransaction(transaction);
  return result.hash;
}

export interface ThresholdParams {
  sourceSecret: string;
  masterWeight?: number;
  lowThreshold?: number;
  medThreshold?: number;
  highThreshold?: number;
  network?: StellarNetwork;
}

export async function setThresholds(params: ThresholdParams): Promise<string> {
  const {
    sourceSecret,
    masterWeight,
    lowThreshold,
    medThreshold,
    highThreshold,
    network = "testnet",
  } = params;

  const sourceKeypair = Keypair.fromSecret(sourceSecret);
  const server = getServer(network);
  const { networkPassphrase } = getNetworkConfig(network);
  const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

  const opts: Record<string, number> = {};
  if (masterWeight !== undefined) opts.masterWeight = masterWeight;
  if (lowThreshold !== undefined) opts.lowThreshold = lowThreshold;
  if (medThreshold !== undefined) opts.medThreshold = medThreshold;
  if (highThreshold !== undefined) opts.highThreshold = highThreshold;

  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(Operation.setOptions(opts as any))
    .setTimeout(30)
    .build();

  transaction.sign(sourceKeypair);
  const result = await server.submitTransaction(transaction);
  return result.hash;
}
