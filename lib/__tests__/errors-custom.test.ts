import { describe, it, expect } from "vitest";
import {
  StellarError,
  ValidationError,
  NetworkError,
  NotFoundError,
  RateLimitError,
} from "@/lib/stellar/errors";

describe("Errors", () => {
  describe("StellarError", () => {
    it("creates error with code and status", () => {
      const err = new StellarError("msg", "TEST", 418);
      expect(err.message).toBe("msg");
      expect(err.code).toBe("TEST");
      expect(err.statusCode).toBe(418);
    });
  });

  describe("ValidationError", () => {
    it("has correct defaults", () => {
      const err = new ValidationError("invalid");
      expect(err.statusCode).toBe(400);
      expect(err.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("NetworkError", () => {
    it("has correct defaults", () => {
      const err = new NetworkError("timeout");
      expect(err.statusCode).toBe(502);
      expect(err.code).toBe("NETWORK_ERROR");
    });
  });

  describe("NotFoundError", () => {
    it("formats message", () => {
      const err = new NotFoundError("Account");
      expect(err.message).toBe("Account not found");
    });
  });

  describe("RateLimitError", () => {
    it("has 429 status", () => {
      const err = new RateLimitError(5000);
      expect(err.statusCode).toBe(429);
    });
  });
});
