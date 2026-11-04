import { describe, it, expect } from "vitest";
import {
  convertToCents,
  convertToDollarUnit,
  formatCurrency,
} from "../format-currency";

describe("Backend Currency Utilities", () => {
  describe("convertToCents", () => {
    it("should convert integer rupees to cents/paisa correctly", () => {
      expect(convertToCents(500)).toBe(50000);
      expect(convertToCents(100)).toBe(10000);
      expect(convertToCents(75000)).toBe(7500000);
    });

    it("should handle decimals properly with rounding", () => {
      expect(convertToCents(12.5)).toBe(1250);
      expect(convertToCents(99.99)).toBe(9999);
    });

    it("should handle zero correctly", () => {
      expect(convertToCents(0)).toBe(0);
    });
  });

  describe("convertToDollarUnit (cents to units)", () => {
    it("should convert cents back to rupees correctly", () => {
      expect(convertToDollarUnit(50000)).toBe(500);
      expect(convertToDollarUnit(7500000)).toBe(75000);
      expect(convertToDollarUnit(9999)).toBe(99.99);
    });

    it("should handle zero correctly", () => {
      expect(convertToDollarUnit(0)).toBe(0);
    });
  });

  describe("formatCurrency", () => {
    it("should format number as INR currency string", () => {
      const formatted = formatCurrency(500);
      expect(formatted).toContain("500");
      expect(formatted).toMatch(/₹|INR/);
    });

    it("should apply Indian numbering system grouping", () => {
      const formatted = formatCurrency(150000);
      // In Indian numbering, 150000 is 1,50,000
      expect(formatted).toContain("1,50,000");
    });
  });
});
