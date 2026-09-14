export interface SimulationResult {
  success: boolean;
  operations: SimulatedOperation[];
  fee: string;
  ledger: number;
}

export interface SimulatedOperation {
  type: string;
  source: string;
  effects: Array<{
    type: string;
    asset?: string;
    amount?: string;
    from?: string;
    to?: string;
  }>;
}

export function createSimulation(
  operations: Array<{ type: string; source: string }>,
  fee: string = "100",
): SimulationResult {
  return {
    success: true,
    operations: operations.map((op) => ({
      type: op.type,
      source: op.source,
      effects: [],
    })),
    fee,
    ledger: 0,
  };
}

export function estimateFeeFromOperations(operationCount: number, baseFee: string = "100"): string {
  return (BigInt(baseFee) * BigInt(operationCount)).toString();
}

export function validateSimulationResult(result: SimulationResult): boolean {
  if (typeof result.success !== "boolean") return false;
  if (!Array.isArray(result.operations)) return false;
  if (typeof result.fee !== "string") return false;
  return true;
}
