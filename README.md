# Stellar Payments Kit

A lightweight, developer-friendly toolkit for building payment flows on the [Stellar](https://stellar.org) network. Includes a TypeScript library, Soroban smart contracts, and an interactive demo app.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript CI](https://github.com/sorostack-org/stellar-payments-kit/actions/workflows/ci-typescript.yml/badge.svg)](https://github.com/sorostack-org/stellar-payments-kit/actions/workflows/ci-typescript.yml)
[![Rust CI](https://github.com/sorostack-org/stellar-payments-kit/actions/workflows/ci-rust.yml/badge.svg)](https://github.com/sorostack-org/stellar-payments-kit/actions/workflows/ci-rust.yml)
[![Tests](https://github.com/sorostack-org/stellar-payments-kit/actions/workflows/ci-tests.yml/badge.svg)](https://github.com/sorostack-org/stellar-payments-kit/actions/workflows/ci-tests.yml)
[![Open Issues](https://img.shields.io/github/issues/sorostack-org/stellar-payments-kit)](https://github.com/sorostack-org/stellar-payments-kit/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![npm version](https://img.shields.io/npm/v/stellar-payments-kit)](https://www.npmjs.com/package/stellar-payments-kit)
[![codecov](https://codecov.io/gh/sorostack-org/stellar-payments-kit/branch/main/graph/badge.svg)](https://codecov.io/gh/sorostack-org/stellar-payments-kit)
[![Maintainability](https://img.shields.io/codeclimate/maintainability/sorostack-org/stellar-payments-kit)](https://codeclimate.com/github/sorostack-org/stellar-payments-kit)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

---

## Why Stellar Payments Kit?

Working directly with `stellar-sdk` means writing a lot of boilerplate — loading accounts, constructing `TransactionBuilder` objects, managing fee estimation, handling testnet vs mainnet switching, and more. This kit abstracts that away so you can focus on your product logic.

**Key goals:**

- Minimal API surface — do the most common things in one line
- TypeScript-first with full type inference
- Supports both Testnet and Mainnet
- Built on top of the official `@stellar/stellar-sdk` — no hidden magic
- Interactive demo UI included
- Soroban smart contract examples in Rust

---

## Features

### TypeScript Library

- **Account funding & management** — fund Testnet accounts via Friendbot
- **XLM & asset transfers** — send native XLM or custom assets with automatic fee estimation
- **Batch payments** — send multiple payments in one transaction
- **Fee-bump transactions** — sponsor transaction fees for users
- **SEP-10 authentication** — anchor authentication flow
- **Soroban contract invocation** — call smart contracts from TypeScript
- **Transaction polling** — wait for transaction confirmation
- **Input validation** — validate keys, amounts, and memos
- **AMM / Liquidity Pools** — create pools and swap tokens
- **Staking & Lending** — stake, unstake, claim rewards, lend, borrow
- **NFT management** — mint, transfer, and burn NFTs
- **Multisig** — configure multi-signature accounts
- **Time locks & escrow** — conditional payment escrows
- **Webhooks & notifications** — event-driven callbacks
- **Rate limiting & caching** — performance optimizations
- **Middleware pipeline** — composable request/response middleware
- **Analytics & metrics** — usage tracking and monitoring

### Soroban Contracts (Rust)

- **Escrow** — trustless escrow with depositor, beneficiary, and arbiter
- **Token Swap** — atomic swap between two parties
- **Payment Splitter** — distribute payments proportionally to multiple payees

### Interactive Demo App

Built with Next.js — explore all features via a clean tabbed interface.

---

## Getting Started

### Prerequisites

- Node.js 18+
- Rust 1.78+ (for Soroban contracts)
- `wasm32-unknown-unknown` target: `rustup target add wasm32-unknown-unknown`

### Installation

```bash
git clone https://github.com/sorostack-org/stellar-payments-kit.git
cd stellar-payments-kit
npm install
```

### Run the demo app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to explore the interactive demo.

### Build Soroban contracts

```bash
cargo build --release --target wasm32-unknown-unknown
```

---

## Usage

### Fund a Testnet account

```typescript
import { fundTestnetAccount } from "@/lib/stellar/accounts";

const { publicKey, secretKey } = await fundTestnetAccount();
```

### Send XLM

```typescript
import { sendPayment } from "@/lib/stellar/payments";

const result = await sendPayment({
  sourceSecret: "S...",
  destinationPublicKey: "G...",
  amount: "10",
  network: "testnet",
});
```

### Batch payments

```typescript
import { sendBatchPayment } from "@/lib/stellar/batch";

const result = await sendBatchPayment({
  sourceSecret: "S...",
  payments: [
    { destinationPublicKey: "G...", amount: "10" },
    { destinationPublicKey: "G...", amount: "20" },
  ],
});
```

### Invoke a Soroban contract

```typescript
import { invokeSorobanContract } from "@/lib/stellar/soroban";

const hash = await invokeSorobanContract({
  sourceSecret: "S...",
  contractId: "CA...",
  functionName: "hello",
  args: [],
});
```

---

## Project Structure

```
stellar-payments-kit/
├── app/                          # Next.js demo UI
├── contracts/                    # Soroban smart contracts (Rust)
│   ├── escrow/
│   ├── token-swap/
│   └── payment-splitter/
├── lib/
│   └── stellar/                  # Core TypeScript library (60+ modules)
│       ├── accounts.ts           # Account creation & funding
│       ├── amm.ts                # Automated Market Maker
│       ├── analytics.ts          # Usage tracking
│       ├── anchor.ts             # SEP integration
│       ├── batch.ts              # Batch payments
│       ├── cache.ts              # In-memory caching
│       ├── claimable-balance.ts  # Claimable balances
│       ├── errors.ts             # Custom error classes
│       ├── governance.ts         # On-chain governance
│       ├── lending.ts            # Lending protocol
│       ├── middleware.ts         # Composable middleware
│       ├── multisig.ts           # Multi-signature
│       ├── nft.ts                # NFT operations
│       ├── payments.ts           # XLM & asset payments
│       ├── rate-limiter.ts       # Rate limiting
│       ├── soroban.ts            # Soroban contract helpers
│       ├── soroban-contract.ts   # Contract deployment
│       ├── staking.ts            # Staking operations
│       ├── streaming.ts          # Event streaming
│       ├── webhooks.ts           # Webhook callbacks
│       └── ... (40+ more modules)
├── docs/                         # Architecture and deployment docs
├── examples/                     # Usage examples
├── scripts/                      # Utility scripts
├── .github/
│   └── workflows/                # CI/CD pipelines (20+ workflows)
├── vitest.config.ts
├── Cargo.toml                    # Rust workspace
├── rust-toolchain.toml
└── Makefile
```

---

## CI/CD

| Workflow | Status |
|---|---|---|
| TypeScript CI (typecheck, lint, build) | [![TypeScript CI](https://github.com/sorostack-org/stellar-payments-kit/actions/workflows/ci-typescript.yml/badge.svg)](https://github.com/sorostack-org/stellar-payments-kit/actions/workflows/ci-typescript.yml) |
| Rust CI (fmt, clippy, build, test) | [![Rust CI](https://github.com/sorostack-org/stellar-payments-kit/actions/workflows/ci-rust.yml/badge.svg)](https://github.com/sorostack-org/stellar-payments-kit/actions/workflows/ci-rust.yml) |
| Tests (sharded, coverage) | [![Tests](https://github.com/sorostack-org/stellar-payments-kit/actions/workflows/ci-tests.yml/badge.svg)](https://github.com/sorostack-org/stellar-payments-kit/actions/workflows/ci-tests.yml) |
| Coverage | [![Coverage](https://github.com/sorostack-org/stellar-payments-kit/actions/workflows/ci-coverage.yml/badge.svg)](https://github.com/sorostack-org/stellar-payments-kit/actions/workflows/ci-coverage.yml) |
| Security Audit | [![Security Audit](https://github.com/sorostack-org/stellar-payments-kit/actions/workflows/security-audit.yml/badge.svg)](https://github.com/sorostack-org/stellar-payments-kit/actions/workflows/security-audit.yml) |
| Benchmark | [![Benchmark](https://github.com/sorostack-org/stellar-payments-kit/actions/workflows/benchmark.yml/badge.svg)](https://github.com/sorostack-org/stellar-payments-kit/actions/workflows/benchmark.yml) |
| CodeQL | [![CodeQL](https://github.com/sorostack-org/stellar-payments-kit/actions/workflows/codeql.yml/badge.svg)](https://github.com/sorostack-org/stellar-payments-kit/actions/workflows/codeql.yml) |
| Deploy Docs | [![Docs](https://github.com/sorostack-org/stellar-payments-kit/actions/workflows/deploy-docs.yml/badge.svg)](https://github.com/sorostack-org/stellar-payments-kit/actions/workflows/deploy-docs.yml) |
| Scorecard | [![Scorecard](https://github.com/sorostack-org/stellar-payments-kit/actions/workflows/scorecard.yml/badge.svg)](https://github.com/sorostack-org/stellar-payments-kit/actions/workflows/scorecard.yml) |
| Sync Labels | [![Labels](https://github.com/sorostack-org/stellar-payments-kit/actions/workflows/sync-labels.yml/badge.svg)](https://github.com/sorostack-org/stellar-payments-kit/actions/workflows/sync-labels.yml) |

---

## Roadmap

- [x] Soroban smart contract invocation helpers
- [x] SEP-10 authentication flow
- [x] Batch payment utilities
- [x] AMM / Liquidity Pool operations
- [x] Staking & lending protocols
- [x] NFT management
- [x] Multisig configuration
- [x] Webhooks & event notifications
- [x] Rate limiting & caching
- [x] Middleware pipeline
- [x] Analytics & metrics
- [ ] SEP-24 deposit/withdrawal helpers
- [ ] React hooks package (`stellar-payments-kit/react`)
- [ ] Stellar ecosystem wallet integration
- [ ] Hardware wallet support

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Documentation

Full documentation is available in the [docs/](docs/) directory including architecture overview, API reference, deployment guides, and more. See [docs/index.md](docs/index.md) for the full index.

---

## License

[MIT](LICENSE) © sorostack-org
