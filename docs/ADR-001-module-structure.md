# ADR-001: Module Structure

## Status

Accepted

## Context

Need a clear organisational structure for the Stellar Payments Kit codebase.

## Decision

Organise as a monorepo with:

- `lib/stellar/` - TypeScript library modules, one per Stellar concept
- `contracts/` - Rust Soroban contracts, one per contract
- `app/` - Next.js demo application
- `docs/` - Documentation
- `.github/` - CI/CD and issue templates

## Consequences

- Clear separation of concerns
- Easy to find relevant code
- CI workflows can target specific paths
