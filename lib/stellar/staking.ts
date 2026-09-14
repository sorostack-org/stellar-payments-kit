export interface StakePosition {
  amount: string;
  lockupPeriodMs: number;
  startTime: number;
  rewards: string;
  apy: number;
}

export function calculateStakingRewards(amount: string, apy: number, durationMs: number): string {
  const principal = Number(amount);
  const years = durationMs / (365.25 * 24 * 60 * 60 * 1000);
  const rate = apy / 100;
  return (principal * rate * years).toString();
}

export function calculateApy(
  totalRewards: string,
  totalStaked: string,
  epochDurationMs: number,
): number {
  const tr = Number(totalRewards);
  const ts = Number(totalStaked);
  if (ts === 0) return 0;
  const epochsPerYear = (365.25 * 24 * 60 * 60 * 1000) / epochDurationMs;
  return (tr / ts) * epochsPerYear * 100;
}

export function isStakeUnlocked(startTime: number, lockupPeriodMs: number): boolean {
  return Date.now() >= startTime + lockupPeriodMs;
}
