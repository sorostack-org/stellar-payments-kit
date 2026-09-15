import {
  Keypair,
  Operation,
  TransactionBuilder,
  BASE_FEE,
  nativeToScVal,
} from "@stellar/stellar-sdk";
import { getServer, getNetworkConfig, StellarNetwork } from "./network";
import { isValidSecretKey } from "./validation";
import { ValidationError, NetworkError, NotFoundError } from "./errors";

export interface SorobanInvokeParams {
  sourceSecret: string;
  contractId: string;
  functionName: string;
  args?: unknown[];
  network?: StellarNetwork;
}

export async function invokeSorobanContract(params: SorobanInvokeParams): Promise<string> {
  const { sourceSecret, contractId, functionName, args = [], network = "testnet" } = params;

  if (!isValidSecretKey(sourceSecret)) {
    throw new ValidationError("Invalid source secret key.");
  }
  if (!contractId) {
    throw new ValidationError("Contract id is required.");
  }
  if (!functionName) {
    throw new ValidationError("Function name is required.");
  }

  const sourceKeypair = Keypair.fromSecret(sourceSecret);
  const server = getServer(network);
  const { networkPassphrase } = getNetworkConfig(network);

  let sourceAccount;
  try {
    sourceAccount = await server.loadAccount(sourceKeypair.publicKey());
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("not found")) {
      throw new NotFoundError(sourceKeypair.publicKey());
    }
    throw new NetworkError(message);
  }

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

  let result;
  try {
    result = await server.submitTransaction(transaction);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new NetworkError(message, 500);
  }

  return result.hash;
}
