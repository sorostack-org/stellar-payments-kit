import { describe, it, expect } from "vitest";
import {
  StellarError,
  NotFoundError,
  ValidationError,
  NetworkError,
  RateLimitError,
} from "@/lib/stellar/errors";

describe("StellarError", () => {
  it("creates an error with code and message", () => {
    const error = new StellarError("Account not found", "NOT_FOUND", 404);
    expect(error.message).toBe("Account not found");
    expect(error.code).toBe("NOT_FOUND");
    expect(error.name).toBe("StellarError");
  });
});

describe("NotFoundError", () => {
  it("formats message with resource name", () => {
    const error = new NotFoundError("Account");
    expect(error.message).toBe("Account not found");
    expect(error.code).toBe("NOT_FOUND");
  });
});

describe("ValidationError", () => {
  it("has correct code and status", () => {
    const error = new ValidationError("Invalid input");
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.statusCode).toBe(400);
  });
});

describe("NetworkError", () => {
  it("has correct defaults", () => {
    const error = new NetworkError("Connection failed");
    expect(error.code).toBe("NETWORK_ERROR");
    expect(error.statusCode).toBe(502);
  });
});

describe("RateLimitError", () => {
  it("has correct defaults", () => {
    const error = new RateLimitError(5000);
    expect(error.code).toBe("RATE_LIMITED");
    expect(error.statusCode).toBe(429);
  });
});
