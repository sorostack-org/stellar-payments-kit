import { describe, it, expect } from "vitest";
import { PaymentEventStream } from "@/lib/stellar/streaming";

describe("PaymentEventStream", () => {
  it("throws with invalid server URL", () => {
    expect(() => new PaymentEventStream("not-a-url", "GABC123", { onMessage: () => {} })).toThrow();
  });
});
