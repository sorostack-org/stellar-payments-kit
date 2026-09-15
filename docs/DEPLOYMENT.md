# Deployment

## Production

1. Build the demo app: `npm run build`
2. Deploy the Next.js demo app to your hosting provider
3. Rust smart contracts can be built to wasm via `cargo build --release --target wasm32v1-none`

## Docker

```bash
docker build -t stellar-payments-kit .
docker run stellar-payments-kit
```

## CI/CD

Pre-configured GitHub Actions workflows handle linting, testing, coverage, security audits, benchmarks, and docs deployment. Releases are created via the Release Drafter workflow.
