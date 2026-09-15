# Getting Started

## Prerequisites

- Node.js 18+
- A Testnet account (fund via `fundTestnetAccount()` using Friendbot)

## Installation

```bash
git clone https://github.com/sorostack-org/stellar-payments-kit.git
cd stellar-payments-kit
npm install
```

## Quick Start

```typescript
import { sendPayment } from "@/lib/stellar/payments";
import { generateKeypair, fundTestnetAccount } from "@/lib/stellar/accounts";

const { publicKey, secretKey } = await fundTestnetAccount();
const result = await sendPayment({
  sourceSecret: secretKey,
  destinationPublicKey: "G...",
  amount: "10",
  network: "testnet",
});
```

## Next Steps

- See the interactive demo app (`npm run dev`) for full usage examples
- Read docs/ for detailed guides
- See [API_REFERENCE.md](API_REFERENCE.md) for the library reference
