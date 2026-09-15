# Performance

## Optimizations

- Retry with exponential backoff for network calls
- In-memory cache for frequent lookups
- Batch transaction submission
- Connection pooling via Horizon SDK

## Benchmarks

Run `npx vitest bench --run` to test key operations.
