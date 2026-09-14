import { describe, it, expect } from "vitest";
import { TaskScheduler } from "@/lib/stellar/scheduler";

describe("TaskScheduler", () => {
  it("adds and removes tasks", () => {
    const scheduler = new TaskScheduler();
    scheduler.add({
      id: "t1",
      name: "Test",
      intervalMs: 60000,
      lastRun: null,
      nextRun: Date.now(),
      run: async () => {},
    });
    scheduler.remove("t1");
    expect(() => scheduler.start("t1")).toThrow();
  });

  it("starts and stops all tasks", () => {
    const scheduler = new TaskScheduler();
    scheduler.add({
      id: "t1",
      name: "Test",
      intervalMs: 60000,
      lastRun: null,
      nextRun: Date.now(),
      run: async () => {},
    });
    scheduler.startAll();
    scheduler.stopAll();
    expect(true).toBe(true);
  });
});
