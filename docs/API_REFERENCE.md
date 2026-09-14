# API Reference

## Modules

### accounts

- `generateKeypair()` — Generate new Stellar keypair
- `createAccount(params)` — Create and fund account
- `getAccountInfo(publicKey, network)` — Get account details

### transactions

- `createPayment(params)` — Send payment

### network

- `getServer(network)` — Get Horizon server instance
- `getNetworkConfig(network)` — Get network configuration

### soroban-contract

- `deployContract(params)` — Deploy Soroban contract
- `invokeContract(params)` — Invoke contract method

### amm

- `createLiquidityPool(params)` — Create AMM pool
- `swap(params)` — Swap tokens via AMM

### staking

- `stake(params)` — Stake tokens
- `unstake(params)` — Unstake tokens
- `claimRewards(params)` — Claim staking rewards

See inline TypeScript types for full parameter details.
