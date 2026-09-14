import { describe, it, expect } from "vitest";
import { HealthChecker } from "@/lib/stellar/health";

describe("HealthChecker", () => {
  it("returns healthy for empty checks", async () => {
    const hc = new HealthChecker();
    const result = await hc.check();
    expect(result.status).toBe("healthy");
  });

  it("includes component results", async () => {
    const hc = new HealthChecker();
    hc.register("test", async () => ({ status: "healthy", latencyMs: 5 }));
    const result = await hc.check();
    expect(result.components.test.status).toBe("healthy");
  });

  it("marks overall as unhealthy on failure", async () => {
    const hc = new HealthChecker();
    hc.register("failing", async () => {
      throw new Error("fail");
    });
    const result = await hc.check();
    expect(result.status).toBe("unhealthy");
  });
});
