export interface HealthCheck {
  status: "healthy" | "degraded" | "unhealthy";
  components: Record<string, ComponentHealth>;
  timestamp: number;
}

export interface ComponentHealth {
  status: "healthy" | "degraded" | "unhealthy";
  latencyMs?: number;
  error?: string;
}

export class HealthChecker {
  private checks: Map<string, () => Promise<ComponentHealth>> = new Map();

  register(name: string, check: () => Promise<ComponentHealth>): void {
    this.checks.set(name, check);
  }

  async check(): Promise<HealthCheck> {
    const components: Record<string, ComponentHealth> = {};
    let overall: "healthy" | "degraded" | "unhealthy" = "healthy";

    for (const [name, check] of this.checks) {
      try {
        components[name] = await check();
        if (components[name].status === "unhealthy") overall = "unhealthy";
        else if (components[name].status === "degraded" && overall === "healthy")
          overall = "degraded";
      } catch (error) {
        components[name] = {
          status: "unhealthy",
          error: error instanceof Error ? error.message : String(error),
        };
        overall = "unhealthy";
      }
    }

    return { status: overall, components, timestamp: Date.now() };
  }
}

export function createLatencyCheck(name: string, url: string): () => Promise<ComponentHealth> {
  return async () => {
    const start = performance.now();
    const response = await fetch(url);
    const latencyMs = performance.now() - start;
    return {
      status: response.ok ? "healthy" : "degraded",
      latencyMs,
    };
  };
}
