# Error Handling

All functions throw typed errors that can be caught and handled:

```typescript
import { StellarPaymentError, isNotFoundError } from "@/lib/stellar/errors";

try {
  await getAccountInfo("G...");
} catch (error) {
  if (isNotFoundError(error)) {
    console.log("Account does not exist");
  }
}
```

## Error Codes

- `ACCOUNT_NOT_FOUND` - Account doesn't exist on network
- `INSUFFICIENT_BALANCE` - Not enough XLM/asset balance
- `INVALID_AMOUNT` - Amount format is invalid
- `NETWORK_ERROR` - Horizon/network connectivity issue
- `TX_FAILED` - Transaction submission failed
