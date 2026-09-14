import { Keypair, TransactionBuilder, Operation, Asset, BASE_FEE } from "@stellar/stellar-sdk";
import { getServer, getNetworkConfig, StellarNetwork } from "./network";

export interface TimeLockedPaymentParams {
  sourceSecret: string;
  destinationPublicKey: string;
  amount: string;
  unlockAt: Date;
  asset?: { code: string; issuer: string };
  network?: StellarNetwork;
}

export async function sendTimeLockedPayment(params: TimeLockedPaymentParams): Promise<string> {
  const {
    sourceSecret,
    destinationPublicKey,
    amount,
    unlockAt,
    asset: assetParam,
    network = "testnet",
  } = params;

  const sourceKeypair = Keypair.fromSecret(sourceSecret);
  const server = getServer(network);
  const { networkPassphrase } = getNetworkConfig(network);
  const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

  const asset = assetParam ? new Asset(assetParam.code, assetParam.issuer) : Asset.native();
  const minTime = Math.floor(unlockAt.getTime() / 1000);
  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase,
    timebounds: { minTime, maxTime: 0 },
  })
    .addOperation(
      Operation.payment({
        destination: destinationPublicKey,
        asset,
        amount,
      }),
    )
    .setTimeout(0)
    .build();
  transaction.sign(sourceKeypair);

  const result = await server.submitTransaction(transaction);
  return result.hash;
}
