# Data Flow

## Payment Flow

1. Client calls `sendPayment(params)`
2. Module loads source account from Horizon
3. Builds transaction with appropriate operations
4. Signs transaction with source keypair
5. Submits to Horizon network
6. Returns transaction hash and ledger

## Soroban Contract Flow

1. Client calls `invokeSorobanContract(params)`
2. Module prepares Soroban authorization
3. Builds and signs transaction
4. Submits to Soroban RPC endpoint
5. Polls for completion
6. Returns result

## Error Flow

All network errors are wrapped in `StellarError` classes with appropriate error codes and messages.
