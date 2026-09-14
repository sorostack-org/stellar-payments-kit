export interface PoolReserves {
  assetA: string;
  assetB: string;
  reserveA: string;
  reserveB: string;
  fee: number;
}

export function calculateSwapOutput(
  inputAmount: string,
  inputReserve: string,
  outputReserve: string,
  feeBps: number = 30,
): string {
  const input = BigInt(inputAmount);
  const reserveIn = BigInt(inputReserve);
  const reserveOut = BigInt(outputReserve);
  const fee = BigInt(feeBps);
  const basisPoints = BigInt(10000);

  const inputWithFee = (input * (basisPoints - fee)) / basisPoints;
  const numerator = inputWithFee * reserveOut;
  const denominator = reserveIn + inputWithFee;

  if (denominator === BigInt(0)) return "0";
  return (numerator / denominator).toString();
}

export function calculatePoolShare(liquidityTokens: string, totalLiquidity: string): number {
  const shares = Number(liquidityTokens);
  const total = Number(totalLiquidity);
  if (total === 0) return 0;
  return shares / total;
}

export function calculateLpTokens(
  amountA: string,
  amountB: string,
  totalLiquidity: string,
  reserveA: string,
  reserveB: string,
): string {
  if (totalLiquidity === "0" || totalLiquidity === "0") {
    return Math.sqrt(Number(amountA) * Number(amountB)).toString();
  }
  const shareA = (BigInt(amountA) * BigInt(totalLiquidity)) / BigInt(reserveA);
  const shareB = (BigInt(amountB) * BigInt(totalLiquidity)) / BigInt(reserveB);
  return shareA < shareB ? shareA.toString() : shareB.toString();
}
