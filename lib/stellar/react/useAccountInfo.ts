"use client";
import { useState, useCallback } from "react";
import { getAccountInfo, AccountInfo } from "../accounts";

interface AccountInfoState {
  info: AccountInfo | null;
  error: string | null;
  loading: boolean;
}

export function useAccountInfo() {
  const [state, setState] = useState<AccountInfoState>({
    info: null,
    error: null,
    loading: false,
  });

  const fetch = useCallback(async (publicKey: string) => {
    setState({ info: null, error: null, loading: true });
    try {
      const info = await getAccountInfo(publicKey);
      setState({ info, error: null, loading: false });
      return info;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setState({ info: null, error: msg, loading: false });
      throw err;
    }
  }, []);

  return { ...state, fetch };
}
