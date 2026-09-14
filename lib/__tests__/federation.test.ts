import { afterEach, describe, it, expect, vi } from "vitest";
import { resolveFederationAddress } from "@/lib/stellar/federation";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("resolveFederationAddress", () => {
  it("throws on invalid address format", async () => {
    await expect(resolveFederationAddress("invalid")).rejects.toThrow("Invalid federation address");
  });

  it("throws when the domain's stellar.toml is unreachable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        return {
          ok: false,
          status: 404,
        } as Response;
      }),
    );
    await expect(resolveFederationAddress("user*nonexistent.domain")).rejects.toThrow();
  });
});
