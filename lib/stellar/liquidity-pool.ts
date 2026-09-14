import { Keypair, TransactionBuilder, Operation, Asset, BASE_FEE } from "@stellar/stellar-sdk";
import { getServer, getNetworkConfig, StellarNetwork } from "./network";

export interface LiquidityPoolParams {
  sourceSecret: string;
  assetA: { code: string; issuer: string };
  assetB: { code: string; issuer: string };
  depositAmountA: string;
  depositAmountB: string;
  minPrice: string;
  maxPrice: string;
  network?: StellarNetwork;
}

export async function depositLiquidityPool(params: LiquidityPoolParams): Promise<string> {
  const {
    sourceSecret,
    assetA,
    assetB,
    depositAmountA,
    depositAmountB,
    minPrice,
    maxPrice,
    network = "testnet",
  } = params;

  const sourceKeypair = Keypair.fromSecret(sourceSecret);
  const server = getServer(network);
  const { networkPassphrase } = getNetworkConfig(network);
  const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

  const assetAObj = new Asset(assetA.code, assetA.issuer);
  const assetBObj = new Asset(assetB.code, assetB.issuer);

  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(
      Operation.liquidityPoolDeposit({
        liquidityPoolId: "0000000000000000000000000000000000000000000000000000000000000000",
        maxAmountA: depositAmountA,
        maxAmountB: depositAmountB,
        minPrice: { n: 1, d: 1 },
        maxPrice: { n: 1, d: 1 },
      }),
    )
    .setTimeout(30)
    .build();

  transaction.sign(sourceKeypair);
  const result = await server.submitTransaction(transaction);
  return result.hash;
}
