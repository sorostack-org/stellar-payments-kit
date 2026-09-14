import {
  Keypair,
  TransactionBuilder,
  Operation,
  Asset,
  BASE_FEE,
  xdr,
  Claimant,
} from "@stellar/stellar-sdk";
import { getServer, getNetworkConfig, StellarNetwork } from "./network";

export interface CreateClaimableBalanceParams {
  sourceSecret: string;
  claimant: string;
  amount: string;
  asset?: { code: string; issuer: string };
  network?: StellarNetwork;
}

export async function createClaimableBalance(
  params: CreateClaimableBalanceParams,
): Promise<string> {
  const { sourceSecret, claimant, amount, asset: assetParam, network = "testnet" } = params;

  const sourceKeypair = Keypair.fromSecret(sourceSecret);
  const server = getServer(network);
  const { networkPassphrase } = getNetworkConfig(network);
  const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

  const asset = assetParam ? new Asset(assetParam.code, assetParam.issuer) : Asset.native();

  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(
      Operation.createClaimableBalance({
        asset,
        amount,
        claimants: [new Claimant(claimant, xdr.ClaimPredicate.claimPredicateUnconditional())],
      }),
    )
    .setTimeout(30)
    .build();

  transaction.sign(sourceKeypair);
  const result = await server.submitTransaction(transaction);
  return result.hash;
}

export async function claimBalance(
  sourceSecret: string,
  balanceId: string,
  network: StellarNetwork = "testnet",
): Promise<string> {
  const sourceKeypair = Keypair.fromSecret(sourceSecret);
  const server = getServer(network);
  const { networkPassphrase } = getNetworkConfig(network);
  const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(
      Operation.claimClaimableBalance({
        balanceId,
      }),
    )
    .setTimeout(30)
    .build();

  transaction.sign(sourceKeypair);
  const result = await server.submitTransaction(transaction);
  return result.hash;
}
