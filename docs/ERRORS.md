# Error Handling

All functions throw typed errors that can be caught and handled:

```typescript
import { NotFoundError, StellarError } from "@/lib/stellar/errors";

try {
  await getAccountInfo("G...");
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log("Account does not exist");
  } else if (error instanceof StellarError) {
    console.log(`Stellar error: ${error.message}`);
  }
}
```

## Error Types

- `StellarError` - Base error for Stellar operations
- `ValidationError` - Invalid input parameters
- `NetworkError` - Horizon/network connectivity issue
- `NotFoundError` - Account, asset, or data not found
- `RateLimitError` - Horizon rate limiting exceeded
