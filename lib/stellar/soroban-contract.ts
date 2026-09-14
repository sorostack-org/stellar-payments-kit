export interface SorobanContract {
  contractId: string;
  networkPassphrase: string;
  rpcUrl: string;
}

export function createContractInstance(
  contractId: string,
  networkPassphrase: string,
  rpcUrl: string,
): SorobanContract {
  return { contractId, networkPassphrase, rpcUrl };
}

export function formatContractCall(contractId: string, method: string, args: unknown[]): string {
  const serialized = args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)));
  return `${contractId}:${method}(${serialized.join(",")})`;
}

export function parseContractError(error: string): {
  code: string;
  message: string;
} {
  const match = error.match(/Error\(ContractError\((\d+)\)\)/);
  if (match) {
    const codes: Record<string, string> = {
      "0": "OK",
      "1": "UNKNOWN_ERROR",
      "2": "INVALID_INPUT",
      "3": "INSUFFICIENT_BALANCE",
    };
    const codeNum = match[1];
    return {
      code: codes[codeNum] ?? "UNKNOWN",
      message: `Contract error code ${codeNum}`,
    };
  }
  return { code: "UNKNOWN", message: error };
}
