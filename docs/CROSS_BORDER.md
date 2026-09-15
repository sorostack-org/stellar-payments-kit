# Cross-Border Payments

## Overview

Stellar enables fast, low-cost cross-border payments. This kit provides the primitives to build cross-border payment flows.

## Key Concepts

- **Anchor** — Trusted entity that bridges Stellar and local currency
- **SEP-24** — Interactive anchor deposit/withdrawal
- **SEP-31** — Cross-border payment flow
- **SEP-38** — Asset conversion

## Implementation

1. Set up anchor integration using `anchor.ts` module
2. Use SEP-10 authentication for KYC
3. Send payments via `payments.ts` or `batch.ts`
4. Track settlement with `tx-status.ts`

See the Anchor module for SEP integration helpers.
