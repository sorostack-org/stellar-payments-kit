import {
  Keypair,
  Operation,
  nativeToScVal,
  TransactionBuilder,
  BASE_FEE,
} from "@stellar/stellar-sdk";
import { getServer, getNetworkConfig, StellarNetwork } from "./network";

export interface SorobanAuthParams {
  sourceSecret: string;
  contractId: string;
  functionName?: string;
  network?: StellarNetwork;
}

export async function authenticateWithSoroban(params: SorobanAuthParams): Promise<string> {
  const { sourceSecret, contractId, functionName = "authenticate", network = "testnet" } = params;

  const sourceKeypair = Keypair.fromSecret(sourceSecret);
  const server = getServer(network);
  const { networkPassphrase } = getNetworkConfig(network);
  const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

  const invokeOperation = Operation.invokeContractFunction({
    contract: contractId,
    function: functionName,
    args: [nativeToScVal(sourceKeypair.publicKey())],
    auth: [],
  });

  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(invokeOperation)
    .setTimeout(30)
    .build();

  transaction.sign(sourceKeypair);
  const result = await server.submitTransaction(transaction);
  return result.hash;
}
