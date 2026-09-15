# Stellar Payments Kit — Core Library

## Modules

This directory contains the core TypeScript library organized by concern:

### Accounts & Payments

- `accounts.ts` — Keypair generation, Friendbot funding, account info
- `payments.ts` — XLM and custom asset payment operations
- `transactions.ts` — Fee-bump transactions, XDR decoding, explorer URLs
- `batch.ts` — Batch payment operations (multiple payments, one transaction)
- `fee-estimation.ts` — Fee estimation utilities

### Smart Contracts

- `soroban.ts` — Soroban contract invocation helpers
- `soroban-auth.ts` — Soroban authentication
- `soroban-contract.ts` — Contract instance creation and call formatting
- `soroban-token.ts` — Token response parsing and amount formatting
- `wasm-loader.ts` — Contract WASM loading and built-contract listing
- `simulation.ts` — Transaction simulation helpers

### DeFi

- `amm.ts` — Swap/output/pool-share calculations
- `liquidity-pool.ts` — Liquidity pool deposit helpers
- `lending.ts` — Health factor and liquidation calculations
- `staking.ts` — Reward, APY, and unlock calculations
- `oracle.ts` — Asset price lookups
- `manage-offer.ts` — Sell offer management
- `path-payment.ts` — Path payment sending

### Security

- `multisig.ts` — Multi-signature configuration
- `signer.ts` — Ed25519, hash, and pre-auth signer helpers
- `cold-storage.ts` — Cold storage account setup
- `time-lock.ts` — Time-locked transactions
- `escrow-account.ts` — Escrow account setup
- `account-flags.ts` — Account authorization flags
- `recovery.ts` — Secret splitting and keypair recovery

### Network & Infrastructure

- `network.ts` — Network configuration (testnet/mainnet)
- `stellar-toml.ts` — Stellar TOML fetching
- `federation.ts` — Federation address resolution
- `webhooks.ts` — Webhook callbacks and events
- `notifications.ts` — Notification dispatching
- `scheduler.ts` — Scheduled task execution
- `streaming.ts` — Event stream handling
- `events.ts` — Payment/transaction/operation subscriptions

### Utilities

- `validation.ts` — Input validation
- `sanitize.ts` — Data sanitization
- `constants.ts` — Network constants and error codes
- `errors.ts` — Custom error classes
- `utils.ts` — General utility functions
- `format.ts` — Formatting helpers
- `tx-status.ts` — Transaction status polling

### Performance

- `cache.ts` — In-memory caching
- `retry.ts` — Retry with exponential backoff
- `rate-limiter.ts` — Rate limiting
- `metrics.ts` — Performance metrics
- `health.ts` — Latency checks and health checking

### Integration

- `middleware.ts` — Composable middleware pipeline
- `analytics.ts` — Usage analytics tracking
- `integrations.ts` — Third-party integrations
- `anchor.ts` — Anchor URL and asset validation

### SEP

- `sep10.ts` — SEP-10 WebAuth authentication

### Other

- `governance.ts` — On-chain governance helpers
- `nft.ts` — NFT metadata validation and identifier formatting
- `identity.ts` — Identity management
- `pagination.ts` — Account transactions/payments pagination
- `payment-channel.ts` — Payment channel management
- `payment-stream.ts` — Payment stream handling
- `recurring-payment.ts` — Recurring payment scheduling
- `channel.ts` — Channel account management
- `sponsorship.ts` — Sponsorship operations
- `claimable-balance.ts` — Claimable balance creation and claiming
- `data-entry.ts` — Account data entry management
- `bump-sequence.ts` — Account sequence bumping
- `set-options.ts` — Account options/signer management
- `account-merge.ts` — Account merging
