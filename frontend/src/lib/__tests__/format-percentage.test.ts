import { describe, it, expect } from "vitest";
import { formatPercentage } from "../format-percentage";

describe("Frontend formatPercentage", () => {
  it("formats positive number as percent with 1 decimal default", () => {
    const result = formatPercentage(25);
    expect(result).toBe("25.0%");
  });

  it("handles custom decimal places", () => {
    const result = formatPercentage(12.3456, { decimalPlaces: 2 });
    expect(result).toBe("12.35%");
  });

  it("adds '+' sign for positive income/balance when showSign is true", () => {
    const result = formatPercentage(15, { showSign: true });
    expect(result).toBe("+15.0%");
  });

  it("adds '-' sign for negative income/balance when showSign is true", () => {
    const result = formatPercentage(-10, { showSign: true });
    expect(result).toBe("-10.0%");
  });

  it("inverts sign interpretation when isExpense is true", () => {
    // For expense: increase (>0) is bad (-), decrease (<=0) is good (+)
    const expenseIncrease = formatPercentage(20, { showSign: true, isExpense: true });
    expect(expenseIncrease).toBe("-20.0%");

    const expenseDecrease = formatPercentage(-15, { showSign: true, isExpense: true });
    expect(expenseDecrease).toBe("+15.0%");
  });

  it("returns 0% for NaN or non-number inputs", () => {
    expect(formatPercentage(NaN)).toBe("0%");
    expect(formatPercentage("test" as any)).toBe("0%");
  });
});
