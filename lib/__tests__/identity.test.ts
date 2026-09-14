import { describe, it, expect } from "vitest";
import {
  createIdentityManager,
  addIdentity,
  removeIdentity,
  setDefaultIdentity,
  getDefaultIdentity,
} from "@/lib/stellar/identity";

describe("Identity", () => {
  it("creates empty manager", () => {
    const mgr = createIdentityManager();
    expect(mgr.identities).toHaveLength(0);
    expect(mgr.defaultIdentity).toBeNull();
  });

  it("adds identities", () => {
    let mgr = createIdentityManager();
    mgr = addIdentity(mgr, { publicKey: "GABC", secretKey: "SABC" });
    expect(mgr.identities).toHaveLength(1);
  });

  it("removes identities", () => {
    let mgr = createIdentityManager();
    mgr = addIdentity(mgr, { publicKey: "GABC", secretKey: "SABC" });
    mgr = removeIdentity(mgr, "GABC");
    expect(mgr.identities).toHaveLength(0);
  });

  it("sets default identity", () => {
    let mgr = createIdentityManager();
    mgr = addIdentity(mgr, { publicKey: "GABC", secretKey: "SABC" });
    mgr = setDefaultIdentity(mgr, "GABC");
    expect(mgr.defaultIdentity).toBe("GABC");
  });

  it("gets default identity", () => {
    let mgr = createIdentityManager();
    mgr = addIdentity(mgr, { publicKey: "GABC", secretKey: "SABC", label: "main" });
    mgr = setDefaultIdentity(mgr, "GABC");
    const ident = getDefaultIdentity(mgr);
    expect(ident?.label).toBe("main");
  });
});
