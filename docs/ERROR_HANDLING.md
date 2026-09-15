# Error Handling

## Error Classes

The library provides custom error classes in `errors.ts`:

- `StellarError` — Base error class
- `NetworkError` — Network connectivity issues
- `ValidationError` — Input validation failures
- `NotFoundError` — Account, asset, or data not found
- `RateLimitError` — Horizon rate limiting exceeded

## Best Practices

```typescript
import { StellarError, NetworkError, ValidationError } from "@/lib/stellar/errors";

try {
  const result = await sendPayment(params);
} catch (error) {
  if (error instanceof NetworkError) {
    // Retry logic
  } else if (error instanceof ValidationError) {
    // Input correction
  } else {
    // Generic handling
  }
}
```
