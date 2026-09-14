export interface SorobanTokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  contractId: string;
}

export function parseSorobanTokenResponse(response: string, contractId: string): SorobanTokenInfo {
  const parsed = JSON.parse(response);
  return {
    name: parsed.name ?? "",
    symbol: parsed.symbol ?? "",
    decimals: parsed.decimals ?? 7,
    totalSupply: parsed.total_supply ?? "0",
    contractId,
  };
}

export function formatTokenAmount(amount: string, decimals: number): string {
  const padded = amount.padStart(decimals + 1, "0");
  const intPart = padded.slice(0, padded.length - decimals) || "0";
  const decPart = padded.slice(padded.length - decimals);
  return `${intPart}.${decPart}`;
}

export function parseTokenAmount(formatted: string, decimals: number): string {
  const parts = formatted.split(".");
  const intPart = parts[0] ?? "0";
  const decPart = (parts[1] ?? "").padEnd(decimals, "0").slice(0, decimals);
  const combined = intPart + decPart;
  return combined.replace(/^0+/, "") || "0";
}
