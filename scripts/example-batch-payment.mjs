#!/usr/bin/env node

import { generateKeypair } from "../lib/stellar/accounts.mjs";
import { sendBatchPayment } from "../lib/stellar/batch.mjs";

async function main() {
  const source = generateKeypair();
  const dest1 = generateKeypair();
  const dest2 = generateKeypair();

  console.log("Source:", source.publicKey);
  console.log("Dest 1:", dest1.publicKey);
  console.log("Dest 2:", dest2.publicKey);

  try {
    const result = await sendBatchPayment({
      sourceSecret: source.secretKey,
      payments: [
        { destinationPublicKey: dest1.publicKey, amount: "10" },
        { destinationPublicKey: dest2.publicKey, amount: "20" },
      ],
      memo: "Batch payout",
      network: "testnet",
    });
    console.log("Batch sent:", result.hash);
    console.log("Payments:", result.paymentCount);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();
