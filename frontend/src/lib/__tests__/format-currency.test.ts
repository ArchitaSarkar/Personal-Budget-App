import { describe, it, expect } from "vitest";
import { formatCurrency } from "../format-currency";

describe("Frontend formatCurrency", () => {
  it("formats positive INR value with rupee symbol and two decimals", () => {
    const result = formatCurrency(5000);
    // Replace non-breaking spaces with standard space for reliable assertion
    const normalized = result.replace(/\u00A0/g, " ");
    expect(normalized).toContain("₹");
    expect(normalized).toContain("5,000.00");
  });

  it("formats Indian lakh numbering convention correctly", () => {
    const result = formatCurrency(100000);
    const normalized = result.replace(/\u00A0/g, " ");
    expect(normalized).toContain("1,00,000.00");
  });

  it("handles custom decimal places", () => {
    const result = formatCurrency(2500.5, { decimalPlaces: 0 });
    const normalized = result.replace(/\u00A0/g, " ");
    expect(normalized).toContain("2,501");
    expect(normalized).not.toContain(".00");
  });

  it("formats expense correctly as negative", () => {
    const result = formatCurrency(750, { isExpense: true });
    const normalized = result.replace(/\u00A0/g, " ");
    expect(normalized).toContain("-");
    expect(normalized).toContain("750.00");
  });

  it("supports compact notation for large numbers", () => {
    const result = formatCurrency(1000000, { compact: true });
    expect(result).toBeDefined();
    expect(result.length).toBeLessThan(15);
  });

  it("formats zero amount correctly", () => {
    const result = formatCurrency(0);
    const normalized = result.replace(/\u00A0/g, " ");
    expect(normalized).toContain("0.00");
  });
});
