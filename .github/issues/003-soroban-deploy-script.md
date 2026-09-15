---
title: "Add Soroban contract deployment script"
labels: ["enhancement", "scripts"]
---

## Description

Create a Node.js script that automates deploying Soroban contracts to the Stellar network. The script should handle reading WASM files, deploying via the Soroban RPC, and saving deployment addresses.

## Acceptance Criteria

- [ ] Script reads compiled `.wasm` files from `target/wasm32v1-none/release/`
- [ ] Deploys contracts to testnet via Soroban RPC
- [ ] Saves deployed contract IDs to a JSON file
- [ ] Supports configurable network (testnet/mainnet)
- [ ] Error handling for failed deployments
- [ ] Documentation in `docs/DEPLOYMENT.md`

## Resources

- See `contracts/escrow/`, `contracts/token-swap/`, `contracts/payment-splitter/`
- Stellar Soroban RPC docs
