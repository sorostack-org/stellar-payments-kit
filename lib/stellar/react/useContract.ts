"use client";
import { useState, useCallback } from "react";

interface ContractState {
  hash: string | null;
  error: string | null;
  loading: boolean;
}

export function useContract() {
  const [state, setState] = useState<ContractState>({
    hash: null,
    error: null,
    loading: false,
  });

  const invoke = useCallback(
    async (sourceSecret: string, contractId: string, functionName: string, args: string[]) => {
      setState({ hash: null, error: null, loading: true });
      try {
        const { invokeSorobanContract } = await import("../soroban");
        const hash = await invokeSorobanContract({
          sourceSecret,
          contractId,
          functionName,
          args,
        });
        setState({ hash, error: null, loading: false });
        return hash;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setState({ hash: null, error: msg, loading: false });
        throw err;
      }
    },
    [],
  );

  return { ...state, invoke };
}
