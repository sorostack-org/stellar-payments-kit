# Soroban Smart Contracts

## Escrow Contract

Trustless escrow with three parties:

- **Depositor** - Funds the escrow
- **Beneficiary** - Receives funds on release
- **Arbiter** - Resolves disputes (can release or refund)

## Token Swap Contract

Atomic token exchange between two parties:

- **Initiator** - Creates the swap order
- **Counter Party** - Fulfills the swap
- Supports cancel if unfulfilled

## Payment Splitter Contract

Proportional payment distribution:

- Configure payees and their shares
- Receive a single payment
- Distribute proportionally to all payees

## Building

```bash
cargo build --release --target wasm32-unknown-unknown
```

## Testing

```bash
cargo test --all-features
```
