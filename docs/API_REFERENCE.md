# API Reference

All modules are re-exported from the package root (`import * as StellarPaymentsKit from "stellar-payments-kit"`) or importable from their individual module path (e.g. `@/lib/stellar/accounts`).

## Accounts

- `generateKeypair()` — Generate a random Stellar keypair
- `fundTestnetAccount()` — Fund a new Testnet account via Friendbot (`secretKey` returned)
- `fundTestnetAccount(existingPublicKey)` — Fund an existing Testnet account via Friendbot
- `getAccountInfo(publicKey, network)` — Fetch account balances and sequence from Horizon
- `accountExists(publicKey, network)` — Check if an account exists on the network

## Assets

- `describeAsset(code, issuer?)` — Describe an asset (native XLM or custom asset)
- `createAsset(code, issuer)` — Create an asset instance
- `assetToString(asset)` — Serialize an asset to a string

## Payments

- `sendPayment(params)` — Send native XLM
- `sendAssetPayment(params)` — Send a custom asset
- `addTrustline(params)` — Establish a trustline for an asset
- `sendBatchPayment(params)` — Multiple payments in a single transaction (one tx-level memo)

## Transactions

- `buildFeeBumpTransaction(params)` — Wrap a transaction with a fee bump
- `decodeTransactionXdr(xdr)` — Decode XDR into a readable structure
- `getExplorerUrl(hash, network)` — Get a StellarExpert URL for a transaction hash

## SEP-10

- `authenticateWithSep10(params)` — Stellar web authentication with an anchor

## Soroban

- `invokeSorobanContract(params)` — Invoke a smart contract function
- `authenticateWithSoroban(params)` — Build Soroban authorization records
- `createContractInstance(params)` — Create a typed contract client
- `formatContractCall(params)` — Format a contract call
- `parseContractError(error)` — Parse a contract error into a readable message

## Federation & Stellar TOML

- `resolveFederationAddress(address)` — Resolve a `name*stellar.org` federation address
- `fetchStellarToml(domain, network)` — Fetch a domain's `stellar.toml` file

## Network

- `getNetworkConfig(network)` — Get network configuration (passphrase, Horizon URL, etc.)
- `getServer(network)` — Get a Horizon server instance

## Validation

- `isValidPublicKey(key)` — Validate an ed25519 public key
- `isValidSecretKey(key)` — Validate a secret key
- `isValidAmount(amount)` — Validate a numeric amount string
- `isValidMemo(memo)` — Validate a memo string

## Navigation & Status

- `pollTransactionStatus(hash, network)` — Wait for transaction confirmation
- `getAccountTransactions(publicKey, opts)` — Fetch account transactions (paginated)
- `getAccountPayments(publicKey, opts)` — Fetch account payments (paginated)
- `estimateFee(network)` — Estimate base network fees
- `calculateOperationFee(network)` — Estimate fees for an operation

## Other Modules

Full coverage of every exported helper is available per-module:

- **Chain & accounts**: `account-flags`, `account-merge`, `cold-storage`, `escrow-account`, `signer`, `multisig`, `bump-sequence`, `set-options`, `identity`, `recovery`, `sponsorship`, `claimable-balance`, `time-lock`, `trustline`, `data-entry`
- **DeFi**: `amm`, `liquidity-pool`, `manage-offer`, `path-payment`, `lending`, `staking`, `nft`, `oracle`
- **Advanced tx**: `batch`, `payment-channel`, `payment-stream`, `recurring-payment`, `channel`, `events`, `streaming`, `pagination`, `fee-estimation`, `tx-status`, `retry`, `middleware`, `cache`, `rate-limiter`, `health`, `metrics`, `logger`, `analytics`, `sanitize`, `scheduler`, `notifications`, `webhooks`
- **Soroban**: `soroban-token`, `soroban-auth`, `stellar-toml`, `wasm-loader`, `simulation`, `governance`, `anchor`, `integrations`
- **Constants & utilities**: `constants`, `fees`, `format`, `utils`, `errors`

## Errors

- `StellarError` — Base error for Stellar operations
- `ValidationError` — Invalid input parameters
- `NetworkError` — Network/Horizon failures
- `NotFoundError` — Missing accounts, assets, or data
- `RateLimitError` — Horizon rate limiting

See inline TypeScript types (or `npm run docs` with typedoc) for full parameter details.
