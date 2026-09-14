import {
  Keypair,
  Operation,
  TransactionBuilder,
  BASE_FEE,
  nativeToScVal,
} from "@stellar/stellar-sdk";
import { getServer, getNetworkConfig, StellarNetwork } from "./network";

export interface SorobanInvokeParams {
  sourceSecret: string;
  contractId: string;
  functionName: string;
  args?: unknown[];
  network?: StellarNetwork;
}

export async function invokeSorobanContract(params: SorobanInvokeParams): Promise<string> {
  const { sourceSecret, contractId, functionName, args = [], network = "testnet" } = params;

  const sourceKeypair = Keypair.fromSecret(sourceSecret);
  const server = getServer(network);
  const { networkPassphrase } = getNetworkConfig(network);

  const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

  const invokeOperation = Operation.invokeContractFunction({
    contract: contractId,
    function: functionName,
    args: args.map((arg) => nativeToScVal(arg)),
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
