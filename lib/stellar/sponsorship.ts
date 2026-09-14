import { Keypair, TransactionBuilder, Operation, BASE_FEE } from "@stellar/stellar-sdk";
import { getServer, getNetworkConfig, StellarNetwork } from "./network";

export interface SponsorshipParams {
  sponsorSecret: string;
  sponsoredPublicKey: string;
  network?: StellarNetwork;
}

export async function beginSponsoring(params: SponsorshipParams): Promise<string> {
  const { sponsorSecret, sponsoredPublicKey, network = "testnet" } = params;

  const sponsorKeypair = Keypair.fromSecret(sponsorSecret);
  const server = getServer(network);
  const { networkPassphrase } = getNetworkConfig(network);
  const sponsorAccount = await server.loadAccount(sponsorKeypair.publicKey());

  const transaction = new TransactionBuilder(sponsorAccount, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(
      Operation.beginSponsoringFutureReserves({
        sponsoredId: sponsoredPublicKey,
      }),
    )
    .addOperation(
      Operation.endSponsoringFutureReserves({
        source: sponsoredPublicKey,
      }),
    )
    .setTimeout(30)
    .build();

  transaction.sign(sponsorKeypair);
  const result = await server.submitTransaction(transaction);
  return result.hash;
}

export async function revokeSponsorship(
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
      Operation.revokeClaimableBalanceSponsorship({
        balanceId,
      }),
    )
    .setTimeout(30)
    .build();

  transaction.sign(sourceKeypair);
  const result = await server.submitTransaction(transaction);
  return result.hash;
}
