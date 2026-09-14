export async function runBenchmark(
  name: string,
  fn: () => Promise<void>,
  iterations: number = 100,
): Promise<void> {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    await fn();
  }
  const end = performance.now();
  const avg = (end - start) / iterations;
  console.log(`${name}: ${avg.toFixed(3)}ms avg (${iterations} iterations)`);
}

export async function benchmarkKeyGeneration(): Promise<void> {
  const { generateKeypair } = await import("../lib/stellar/accounts");
  await runBenchmark(
    "generateKeypair",
    async () => {
      generateKeypair();
    },
    50,
  );
}

export async function benchmarkValidation(): Promise<void> {
  const { isValidPublicKey } = await import("../lib/stellar/validation");
  await runBenchmark(
    "isValidPublicKey (valid)",
    async () => {
      isValidPublicKey("GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5W34");
    },
    200,
  );
}

if (require.main === module) {
  benchmarkKeyGeneration();
  benchmarkValidation();
}
