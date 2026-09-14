export function calculateMinFee(operationCount: number): string {
  const baseFee = BigInt(100);
  return (baseFee * BigInt(operationCount)).toString();
}

export function calculateMaxFee(operationCount: number, surchargeMultiplier: number = 10): string {
  const base = BigInt(100);
  return (base * BigInt(operationCount) * BigInt(surchargeMultiplier)).toString();
}

export function estimateSorobanFee(
  instructions: number,
  readBytes: number,
  writeBytes: number,
): string {
  const instructionFee = BigInt(instructions) * BigInt(100);
  const readFee = BigInt(readBytes) * BigInt(10);
  const writeFee = BigInt(writeBytes) * BigInt(100);
  return (instructionFee + readFee + writeFee).toString();
}

export function formatFee(fee: string): string {
  const feeNum = BigInt(fee);
  const stroopsInXlm = BigInt(10000000);
  const xlm = Number(feeNum) / Number(stroopsInXlm);
  return `${xlm.toFixed(7)} XLM`;
}
