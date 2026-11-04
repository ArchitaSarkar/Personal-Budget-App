import { describe, it, expect } from "vitest";
import {
  calculateNextOccurrence,
  calulateNextReportDate,
  capitalizeFirstLetter,
} from "../helper";
import { RecurringIntervalEnum } from "../../models/transaction.model";

describe("Backend Helper Utilities", () => {
  describe("calculateNextOccurrence", () => {
    const baseDate = new Date("2026-01-01T00:00:00.000Z");

    it("should correctly calculate next day for DAILY interval", () => {
      const next = calculateNextOccurrence(baseDate, RecurringIntervalEnum.DAILY);
      expect(next.getDate()).toBe(2);
      expect(next.getMonth()).toBe(0); // Jan
    });

    it("should correctly calculate next week for WEEKLY interval", () => {
      const next = calculateNextOccurrence(baseDate, RecurringIntervalEnum.WEEKLY);
      expect(next.getDate()).toBe(8);
      expect(next.getMonth()).toBe(0);
    });

    it("should correctly calculate next month for MONTHLY interval", () => {
      const next = calculateNextOccurrence(baseDate, RecurringIntervalEnum.MONTHLY);
      expect(next.getMonth()).toBe(1); // Feb
      expect(next.getDate()).toBe(1);
    });

    it("should correctly calculate next year for YEARLY interval", () => {
      const next = calculateNextOccurrence(baseDate, RecurringIntervalEnum.YEARLY);
      expect(next.getFullYear()).toBe(2027);
      expect(next.getMonth()).toBe(0);
      expect(next.getDate()).toBe(1);
    });
  });

  describe("calulateNextReportDate", () => {
    it("should calculate start of next month", () => {
      const sentDate = new Date("2026-03-15T10:00:00.000Z");
      const nextReport = calulateNextReportDate(sentDate);
      expect(nextReport.getMonth()).toBe(3); // April (0-indexed 3)
      expect(nextReport.getDate()).toBe(1);
    });
  });

  describe("capitalizeFirstLetter", () => {
    it("should capitalize only the first letter", () => {
      expect(capitalizeFirstLetter("groceries")).toBe("Groceries");
      expect(capitalizeFirstLetter("SALARY")).toBe("Salary");
      expect(capitalizeFirstLetter("hELlO")).toBe("Hello");
    });
  });
});
