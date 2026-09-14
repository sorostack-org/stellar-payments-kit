import { test } from "vitest";

test("basic", async ({ bench }) => {
  await bench("noop", () => {
    // basic benchmark to ensure vitest bench has at least one file
  }).run();
});
