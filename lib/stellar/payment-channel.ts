import { Keypair, TransactionBuilder, Operation, BASE_FEE } from "@stellar/stellar-sdk";
import { getServer, getNetworkConfig, StellarNetwork } from "./network";

export class PaymentChannel {
  private sourceKeypair: Keypair;
  private network: StellarNetwork;

  constructor(sourceSecret: string, network: StellarNetwork = "testnet") {
    this.sourceKeypair = Keypair.fromSecret(sourceSecret);
    this.network = network;
  }

  async buildSignedTransaction(operations: any[]): Promise<string> {
    const server = getServer(this.network);
    const { networkPassphrase } = getNetworkConfig(this.network);
    const account = await server.loadAccount(this.sourceKeypair.publicKey());

    const builder = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase,
    });

    for (const op of operations) {
      builder.addOperation(op);
    }

    const tx = builder.setTimeout(30).build();
    tx.sign(this.sourceKeypair);
    return tx.toXDR();
  }

  getPublicKey(): string {
    return this.sourceKeypair.publicKey();
  }
}
