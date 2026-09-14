import { describe, it, expect } from "vitest";
import { createWebhook, validateWebhookUrl, formatWebhookPayload } from "@/lib/stellar/webhooks";

describe("Webhooks", () => {
  it("creates webhook config", () => {
    const wh = createWebhook({
      url: "https://example.com/hook",
      events: ["payment"],
      secret: "abc",
      enabled: false,
    });
    expect(wh.enabled).toBe(true);
  });

  it("validates webhook URL", () => {
    expect(validateWebhookUrl("https://example.com/hook")).toBe(true);
    expect(validateWebhookUrl("not-a-url")).toBe(false);
  });

  it("formats payload", () => {
    const payload = formatWebhookPayload("payment", { amount: "100" });
    expect(payload).toContain("payment");
    expect(payload).toContain("100");
  });
});
