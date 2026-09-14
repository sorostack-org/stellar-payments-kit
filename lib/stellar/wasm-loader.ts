import * as fs from "fs";
import * as path from "path";

export function loadContractWasm(contractName: string): Buffer {
  const wasmPath = path.resolve(
    process.cwd(),
    "target",
    "wasm32-unknown-unknown",
    "release",
    `${contractName}_contract.wasm`,
  );

  if (!fs.existsSync(wasmPath)) {
    throw new Error(
      `WASM file not found: ${wasmPath}. Build contracts first with 'cargo build --release --target wasm32-unknown-unknown'`,
    );
  }

  return fs.readFileSync(wasmPath);
}

export function listBuiltContracts(): string[] {
  const dir = path.resolve(process.cwd(), "target", "wasm32-unknown-unknown", "release");

  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".wasm"))
    .map((f) => f.replace("_contract.wasm", ""));
}
