import { Keypair, TransactionBuilder, Operation, Asset, BASE_FEE } from "@stellar/stellar-sdk";
import { getServer, getNetworkConfig, StellarNetwork } from "./network";

export interface PathPaymentParams {
  sourceSecret: string;
  destinationPublicKey: string;
  sendAsset: { code: string; issuer: string };
  sendAmount: string;
  destAsset: { code: string; issuer: string };
  destMinAmount: string;
  path?: { code: string; issuer: string }[];
  network?: StellarNetwork;
}

export interface PathPaymentResult {
  hash: string;
  ledger: number;
}

export async function sendPathPayment(params: PathPaymentParams): Promise<PathPaymentResult> {
  const {
    sourceSecret,
    destinationPublicKey,
    sendAsset: send,
    sendAmount,
    destAsset: dest,
    destMinAmount,
    path = [],
    network = "testnet",
  } = params;

  const sourceKeypair = Keypair.fromSecret(sourceSecret);
  const server = getServer(network);
  const { networkPassphrase } = getNetworkConfig(network);
  const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

  const sendAssetObj = new Asset(send.code, send.issuer);
  const destAssetObj = new Asset(dest.code, dest.issuer);
  const pathAssets = path.map((p) => new Asset(p.code, p.issuer));

  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(
      Operation.pathPaymentStrictSend({
        destination: destinationPublicKey,
        sendAsset: sendAssetObj,
        sendAmount,
        destAsset: destAssetObj,
        destMin: destMinAmount,
        path: pathAssets,
      }),
    )
    .setTimeout(30)
    .build();

  transaction.sign(sourceKeypair);
  const result = await server.submitTransaction(transaction);

  return { hash: result.hash, ledger: result.ledger };
}
