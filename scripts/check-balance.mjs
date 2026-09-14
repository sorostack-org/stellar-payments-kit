import { Horizon, Keypair } from "@stellar/stellar-sdk";
import "dotenv/config";

const server = new Horizon.Server("https://horizon-testnet.stellar.org");
const publicKey = process.argv[2];

if (!publicKey) {
  console.error("Usage: node check-balance.mjs <public-key>");
  process.exit(1);
}

const account = await server.loadAccount(publicKey);
for (const balance of account.balances) {
  console.log(`${balance.asset_type}: ${balance.balance}`);
}
