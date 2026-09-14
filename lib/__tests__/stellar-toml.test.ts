import { describe, it, expect, vi } from "vitest";

describe("fetchStellarToml", () => {
  it("throws on invalid domain", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        return {
          ok: false,
          status: 404,
        } as Response;
      }),
    );
    const { fetchStellarToml } = await import("@/lib/stellar/stellar-toml");
    await expect(fetchStellarToml("nonexistent-domain-xyz.com")).rejects.toThrow();
    vi.unstubAllGlobals();
  });
});
