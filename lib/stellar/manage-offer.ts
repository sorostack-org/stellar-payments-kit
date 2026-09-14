import { Keypair, TransactionBuilder, Operation, Asset, BASE_FEE } from "@stellar/stellar-sdk";
import { getServer, getNetworkConfig, StellarNetwork } from "./network";

export interface ManageSellOfferParams {
  sourceSecret: string;
  selling: { code: string; issuer: string };
  buying: { code: string; issuer: string };
  amount: string;
  price: { n: number; d: number };
  offerId?: number;
  network?: StellarNetwork;
}

export async function manageSellOffer(params: ManageSellOfferParams): Promise<string> {
  const { sourceSecret, selling, buying, amount, price, offerId = 0, network = "testnet" } = params;

  const keypair = Keypair.fromSecret(sourceSecret);
  const server = getServer(network);
  const { networkPassphrase } = getNetworkConfig(network);
  const account = await server.loadAccount(keypair.publicKey());

  const sellingAsset = new Asset(selling.code, selling.issuer);
  const buyingAsset = new Asset(buying.code, buying.issuer);

  const tx = new TransactionBuilder(account, { fee: BASE_FEE, networkPassphrase })
    .addOperation(
      Operation.manageSellOffer({
        selling: sellingAsset,
        buying: buyingAsset,
        amount,
        price,
        offerId,
      }),
    )
    .setTimeout(30)
    .build();

  tx.sign(keypair);
  const result = await server.submitTransaction(tx);
  return result.hash;
}
