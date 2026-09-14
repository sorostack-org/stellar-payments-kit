import { Keypair } from "@stellar/stellar-sdk";
import { getServer, StellarNetwork } from "./network";

export interface AccountInfo {
  publicKey: string;
  balances: { asset: string; balance: string }[];
  sequence: string;
}

/**
 * Generates a new random Stellar keypair.
 * Returns the public and secret keys — store the secret key securely.
 */
export function generateKeypair(): { publicKey: string; secretKey: string } {
  const keypair = Keypair.random();
  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secret(),
  };
}

/**
 * Funds a Testnet account using Friendbot.
 * - If no publicKey is provided, generates a new keypair, funds it, and returns both keys.
 * - If a publicKey is provided, funds that account and returns only the public key.
 */
export async function fundTestnetAccount(existingPublicKey: string): Promise<{ publicKey: string }>;
export async function fundTestnetAccount(): Promise<{ publicKey: string; secretKey: string }>;
export async function fundTestnetAccount(
  existingPublicKey?: string,
): Promise<{ publicKey: string; secretKey?: string }> {
  const keypair = existingPublicKey ? null : Keypair.random();
  const publicKey = existingPublicKey ?? keypair!.publicKey();

  const response = await fetch(
    `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`,
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Friendbot failed: ${response.status} ${text}`);
  }

  return keypair ? { publicKey, secretKey: keypair.secret() } : { publicKey };
}

/**
 * Loads account information (balances, sequence number) from the network.
 */
export async function getAccountInfo(
  publicKey: string,
  network: StellarNetwork = "testnet",
): Promise<AccountInfo> {
  const server = getServer(network);
  const account = await server.loadAccount(publicKey);

  const balances = account.balances.map((b) => ({
    asset:
      b.asset_type === "native"
        ? "XLM"
        : `${(b as { asset_code: string }).asset_code}:${(b as { asset_issuer: string }).asset_issuer}`,
    balance: b.balance,
  }));

  return {
    publicKey,
    balances,
    sequence: account.sequence,
  };
}

/**
 * Checks whether an account exists on the network.
 */
export async function accountExists(
  publicKey: string,
  network: StellarNetwork = "testnet",
): Promise<boolean> {
  try {
    const server = getServer(network);
    await server.loadAccount(publicKey);
    return true;
  } catch {
    return false;
  }
}
