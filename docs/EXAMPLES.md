# Examples

The `scripts/` directory contains runnable example scripts:

| Script                      | Description                                       |
| --------------------------- | ------------------------------------------------- |
| `example-fund-account.mjs`  | Generate a keypair and fund Testnet via Friendbot |
| `example-batch-payment.mjs` | Send multiple payments in one transaction         |
| `example-path-payment.mjs`  | Send a path payment                               |
| `check-balance.mjs`         | Check account balance                             |
| `generate-keypair.mjs`      | Print a new Stellar keypair                       |
| `benchmark.ts`              | Run multiple payment benchmarks                   |

Run with:

```bash
node scripts/example-fund-account.mjs
```

See the interactive demo app (`npm run dev`) for a full feature walkthrough.
