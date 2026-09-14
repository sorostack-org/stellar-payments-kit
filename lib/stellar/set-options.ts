import { Keypair, TransactionBuilder, Operation, BASE_FEE } from "@stellar/stellar-sdk";
import { getServer, getNetworkConfig, StellarNetwork } from "./network";

export interface SetOptionsParams {
  sourceSecret: string;
  homeDomain?: string;
  inflationDest?: string;
  clearFlags?: number;
  setFlags?: number;
  masterWeight?: number;
  lowThreshold?: number;
  medThreshold?: number;
  highThreshold?: number;
  network?: StellarNetwork;
}

export async function setAccountOptions(params: SetOptionsParams): Promise<string> {
  const { sourceSecret, network = "testnet", ...options } = params;

  const keypair = Keypair.fromSecret(sourceSecret);
  const server = getServer(network);
  const { networkPassphrase } = getNetworkConfig(network);
  const account = await server.loadAccount(keypair.publicKey());

  const op: Record<string, any> = {};
  if (options.homeDomain) op.homeDomain = options.homeDomain;
  if (options.inflationDest) op.inflationDest = options.inflationDest;
  if (options.clearFlags) op.clearFlags = options.clearFlags;
  if (options.setFlags) op.setFlags = options.setFlags;
  if (options.masterWeight) op.masterWeight = options.masterWeight;
  if (options.lowThreshold) op.lowThreshold = options.lowThreshold;
  if (options.medThreshold) op.medThreshold = options.medThreshold;
  if (options.highThreshold) op.highThreshold = options.highThreshold;

  const tx = new TransactionBuilder(account, { fee: BASE_FEE, networkPassphrase })
    .addOperation(Operation.setOptions(op as any))
    .setTimeout(30)
    .build();

  tx.sign(keypair);
  const result = await server.submitTransaction(tx);
  return result.hash;
}
