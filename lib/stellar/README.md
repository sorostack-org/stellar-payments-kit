# Stellar Payments Kit — Core Library

## Modules

This directory contains the core TypeScript library organized by concern:

### Accounts & Payments

- `accounts.ts` — Account creation, funding, info
- `payments.ts` — XLM and custom asset payment operations
- `transactions.ts` — Transaction building and submission
- `batch.ts` — Batch payment operations
- `fee-estimation.ts` — Fee estimation utilities

### Smart Contracts

- `soroban-contract.ts` — Deploy and invoke Soroban contracts
- `soroban.ts` — Soroban contract interaction helpers
- `soroban-auth.ts` — Soroban authentication
- `soroban-token.ts` — Token contract operations

### DeFi

- `amm.ts` — Automated Market Maker operations
- `liquidity-pool.ts` — Liquidity pool management
- `lending.ts` — Lending protocol integration
- `staking.ts` — Staking operations

### Security

- `multisig.ts` — Multi-signature configuration
- `cold-storage.ts` — Cold storage operations
- `time-lock.ts` — Time-locked transactions
- `escrow-account.ts` — Escrow management

### Network & Infrastructure

- `network.ts` — Network configuration (testnet/mainnet)
- `webhooks.ts` — Webhook callbacks and events
- `notifications.ts` — Notification dispatching
- `scheduler.ts` — Scheduled task execution
- `streaming.ts` — Event stream handling

### Utilities

- `validation.ts` — Input validation
- `sanitize.ts` — Data sanitization
- `constants.ts` — Network constants
- `errors.ts` — Custom error classes
- `utils.ts` — General utility functions
- `format.ts` — Formatting helpers

### Performance

- `cache.ts` — In-memory caching
- `retry.ts` — Retry with exponential backoff
- `rate-limiter.ts` — Rate limiting
- `metrics.ts` — Performance metrics

### Integration

- `middleware.ts` — Composable middleware pipeline
- `analytics.ts` — Usage analytics tracking
- `integrations.ts` — Third-party integrations

### SEP / Anchor

- `sep10.ts` — SEP-10 WebAuth authentication
- `anchor.ts` — Anchor service integration

### Other

- `governance.ts` — On-chain governance
- `nft.ts` — Non-fungible token operations
- `identity.ts` — Identity management
- `health.ts` — Health check endpoints
- `simulation.ts` — Transaction simulation
- `config.ts` — Configuration management
