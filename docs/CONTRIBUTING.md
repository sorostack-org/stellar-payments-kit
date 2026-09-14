# Contributing to Stellar Payments Kit

## Prerequisites

- Node.js 18+
- Rust 1.78+ (for Soroban contracts)
- wasm32-unknown-unknown target (`rustup target add wasm32-unknown-unknown`)

## Setup

```bash
git clone https://github.com/sorostack-org/stellar-payments-kit.git
cd stellar-payments-kit
npm install
```

## Development

### TypeScript

```bash
npm run dev          # Start Next.js dev server
npm run test         # Run tests
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint
```

### Rust

```bash
cargo build --release --target wasm32-unknown-unknown
cargo test --all-features
cargo clippy --all-targets --all-features -- -D warnings
```

## Committing

This project uses conventional commits:

```
feat: add new feature
fix: correct bug
docs: update documentation
test: add tests
chore: maintenance
ci: CI configuration
```

## Pull Request Process

1. Ensure all checks pass locally (`npm run ci && cargo test`)
2. Update docs if needed
3. Link related issues
