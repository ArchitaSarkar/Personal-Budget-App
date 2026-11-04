import { describe, it, expect } from "vitest";
import {
  emailSchema,
  passwordSchema,
  registerSchema,
  loginSchema,
} from "../auth.validator";

describe("Auth Validators", () => {
  describe("emailSchema", () => {
    it("should accept valid email addresses", () => {
      expect(emailSchema.safeParse("user@example.com").success).toBe(true);
      expect(emailSchema.safeParse("john.doe@sub.domain.co").success).toBe(true);
    });

    it("should reject invalid email formats", () => {
      expect(emailSchema.safeParse("notanemail").success).toBe(false);
      expect(emailSchema.safeParse("user@").success).toBe(false);
      expect(emailSchema.safeParse("@example.com").success).toBe(false);
      expect(emailSchema.safeParse("").success).toBe(false);
    });

    it("should trim surrounding whitespace", () => {
      const result = emailSchema.safeParse("  user@example.com  ");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("user@example.com");
      }
    });
  });

  describe("passwordSchema", () => {
    it("should accept passwords with 4 or more characters", () => {
      expect(passwordSchema.safeParse("1234").success).toBe(true);
      expect(passwordSchema.safeParse("myStrongPassword@123").success).toBe(true);
    });

    it("should reject passwords shorter than 4 characters", () => {
      expect(passwordSchema.safeParse("123").success).toBe(false);
      expect(passwordSchema.safeParse("").success).toBe(false);
    });
  });

  describe("registerSchema", () => {
    it("should accept valid registration payload", () => {
      const validPayload = {
        name: "Test User",
        email: "test@example.com",
        password: "securepassword",
      };
      const result = registerSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("should reject missing or empty name", () => {
      const invalidPayload = {
        name: "",
        email: "test@example.com",
        password: "securepassword",
      };
      const result = registerSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("should reject invalid email in registration", () => {
      const invalidPayload = {
        name: "Test User",
        email: "invalid-email",
        password: "securepassword",
      };
      const result = registerSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("should reject short password in registration", () => {
      const invalidPayload = {
        name: "Test User",
        email: "test@example.com",
        password: "12",
      };
      const result = registerSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe("loginSchema", () => {
    it("should accept valid login payload", () => {
      const validPayload = {
        email: "test@example.com",
        password: "mypassword",
      };
      const result = loginSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email or empty password", () => {
      expect(
        loginSchema.safeParse({ email: "invalid", password: "mypassword" }).success
      ).toBe(false);
      expect(
        loginSchema.safeParse({ email: "test@example.com", password: "" }).success
      ).toBe(false);
    });
  });
});
