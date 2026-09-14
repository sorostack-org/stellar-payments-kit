# API Reference

## Accounts

- `generateKeypair()` - Generate random Stellar keypair
- `fundTestnetAccount()` - Fund account via Friendbot
- `getAccountInfo(publicKey)` - Fetch account balances and sequence
- `accountExists(publicKey)` - Check if account exists

## Payments

- `sendPayment(params)` - Send native XLM
- `sendAssetPayment(params)` - Send custom asset
- `sendBatchPayment(params)` - Multiple payments in one tx
- `sendPathPayment(params)` - Path payment with strict send

## Transactions

- `buildFeeBumpTransaction(params)` - Wrap tx with fee bump
- `decodeTransactionXdr(xdr)` - Decode XDR to readable format
- `getExplorerUrl(hash)` - Get Stellar Expert URL

## Soroban

- `invokeSorobanContract(params)` - Call smart contract
- `authenticateWithSoroban(params)` - Contract auth

## SEP-10

- `authenticateWithSep10(...)` - Stellar web auth

## Utilities

- `validatePublicKey(key)` / `validateSecretKey(key)`
- `estimateFee(network)` - Network fee estimation
- `pollTransactionStatus(hash)` - Wait for confirmation
- Various asset, signer, and account helpers
