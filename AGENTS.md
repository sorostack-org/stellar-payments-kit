<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:work-state -->
## Work State

### Objective
Build a genuinely useful, well-tested Stellar payments library and set of smart contracts.
Every commit must be a real, reviewable change; never fabricate activity or commit counts.

### Key Constraints
- Windows PowerShell 5.1 — no `&&`, one git command at a time
- Network IS available (git push, `gh`, `cargo` fetch all work)
- Rust CI runs on `ubuntu-latest`; no native Rust compilation is possible on this Windows box (no working gcc/link.exe), so all Rust verification happens via GitHub CI

### Completed in This Session
- Fixed Rust CI (soroban-sdk 27 migration) — single commit `1e33032`, all 4 jobs green (Format, Build, Clippy, Test)
  - **Root cause**: contracts depended on `soroban-sdk` without its `testutils` feature, so `Address::generate` and `Env::register_contract` (testutils-gated) were "not found"
  - Enabled `testutils` via `[dev-dependencies] soroban-sdk = { workspace = true, features = ["testutils"] }` in all 3 contracts (keeps the wasm release build lean — dev-deps excluded from lib builds)
  - Replaced deprecated `env.register_contract(None, X)` → `env.register(X, ())`
  - Added `#[derive(Clone)]` to `EscrowState` (was breaking `Escrow: Clone`)
  - Added `use soroban_sdk::testutils::Address as _;` (trait method `generate`) and `env.mock_all_auths();` to each test
  - Switched wasm build target `wasm32-unknown-unknown` → `wasm32v1-none` (soroban-sdk 27 build.rs deliberately rejects the old target on Rust 1.82+) in `rust-toolchain.toml` and `ci-rust.yml`
  - Fixed clippy `precedence` lint (cast precedence parens in payment-splitter `distribute`)
  - Dropped `cargo test --doc` step (contracts are `cdylib`-only, no library targets for doc tests)
- Rebased on 12 new dependabot commits (deps/action bumps) before pushing; force-pushed a single clean migration commit

### Historical (prior session, JS/Next.js side)
- Replaced `eslint-config-next` with direct `@typescript-eslint` parser/plugin (ESLint 10 compat); fixed Security Audit, Benchmark, Codespell, Release Drafter, Scorecard CI checks; `deploy-docs.yml` conditional on Pages enabled
<!-- END:work-state -->
