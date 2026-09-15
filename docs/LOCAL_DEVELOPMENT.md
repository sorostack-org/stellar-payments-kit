# Local Development

## Setup

```bash
git clone https://github.com/sorostack-org/stellar-payments-kit.git
cd stellar-payments-kit
npm install
```

## Commands

- `npm test` — Run tests (vitest)
- `npm run typecheck` — Type-check the TypeScript library
- `npm run build` — Build the Next.js demo app
- `npm run lint` — Lint code

## Stellar Quickstart (Docker)

```bash
docker run --rm -it -p 8000:8000 stellar/quickstart --testnet
```

Then set `network: "custom"` with `horizonUrl: "http://localhost:8000"`.
