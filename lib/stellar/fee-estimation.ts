import { BASE_FEE } from "@stellar/stellar-sdk";
import { getServer, StellarNetwork } from "./network";

export interface FeeEstimate {
  recommendedFee: string;
  minimumFee: string;
  modeFee: string;
  lastLedgerBaseFee: string;
}

export async function estimateFee(network: StellarNetwork = "testnet"): Promise<FeeEstimate> {
  const server = getServer(network);

  try {
    const feeStats = await server.feeStats();
    return {
      recommendedFee: feeStats.max_fee.mode,
      minimumFee: BASE_FEE,
      modeFee: feeStats.max_fee.mode,
      lastLedgerBaseFee: feeStats.last_ledger_base_fee,
    };
  } catch {
    return {
      recommendedFee: BASE_FEE,
      minimumFee: BASE_FEE,
      modeFee: BASE_FEE,
      lastLedgerBaseFee: BASE_FEE,
    };
  }
}

export function calculateOperationFee(operationCount: number, baseFee: string = BASE_FEE): string {
  return String(Number(baseFee) * operationCount);
}
