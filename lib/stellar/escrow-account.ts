import { Keypair, TransactionBuilder, Operation, Asset, BASE_FEE } from "@stellar/stellar-sdk";
import { getServer, getNetworkConfig, StellarNetwork } from "./network";

export interface SetupEscrowParams {
  sourceSecret: string;
  escrowPublicKey: string;
  amount: string;
  asset?: { code: string; issuer: string };
  network?: StellarNetwork;
}

export async function setupEscrowAccount(params: SetupEscrowParams): Promise<string> {
  const { sourceSecret, escrowPublicKey, amount, asset: assetParam, network = "testnet" } = params;

  const keypair = Keypair.fromSecret(sourceSecret);
  const server = getServer(network);
  const { networkPassphrase } = getNetworkConfig(network);
  const account = await server.loadAccount(keypair.publicKey());

  const asset = assetParam ? new Asset(assetParam.code, assetParam.issuer) : Asset.native();

  const tx = new TransactionBuilder(account, { fee: BASE_FEE, networkPassphrase })
    .addOperation(
      Operation.createAccount({
        destination: escrowPublicKey,
        startingBalance: "2",
      }),
    )
    .addOperation(
      Operation.payment({
        destination: escrowPublicKey,
        asset,
        amount,
      }),
    )
    .setTimeout(30)
    .build();

  tx.sign(keypair);
  const result = await server.submitTransaction(tx);
  return result.hash;
}
