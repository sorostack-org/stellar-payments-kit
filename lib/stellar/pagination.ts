import { getServer, StellarNetwork } from "./network";

export interface PaginationOptions {
  limit?: number;
  cursor?: string;
  order?: "asc" | "desc";
}

export interface PaginatedResult<T> {
  records: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export async function getAccountTransactions(
  publicKey: string,
  options: PaginationOptions = {},
  network: StellarNetwork = "testnet",
): Promise<PaginatedResult<any>> {
  const { limit = 10, cursor, order = "desc" } = options;
  const server = getServer(network);

  let callBuilder = server.transactions().forAccount(publicKey).limit(limit).order(order);

  if (cursor) {
    callBuilder = callBuilder.cursor(cursor);
  }

  const page = await callBuilder.call();

  return {
    records: page.records,
    nextCursor: null,
    hasMore: typeof page.next === "function",
  };
}

export async function getAccountPayments(
  publicKey: string,
  options: PaginationOptions = {},
  network: StellarNetwork = "testnet",
): Promise<PaginatedResult<any>> {
  const { limit = 10, cursor, order = "desc" } = options;
  const server = getServer(network);

  let callBuilder = server.payments().forAccount(publicKey).limit(limit).order(order);

  if (cursor) {
    callBuilder = callBuilder.cursor(cursor);
  }

  const page = await callBuilder.call();

  return {
    records: page.records,
    nextCursor: null,
    hasMore: typeof page.next === "function",
  };
}
