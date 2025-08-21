import { addDays, addMonths, addWeeks, addYears, startOfMonth } from "date-fns";
import { RecurringIntervalEnum } from "../models/transaction.model";

export function calulateNextReportDate(lastSentDate?: Date): Date { // Calculate the next report date based on the last sent date
  const now = new Date();
  const lastSent = lastSentDate || now;

  const nextDate = startOfMonth(addMonths(lastSent, 1)); // Set to the start of the next month
  nextDate.setHours(0, 0, 0, 0);

  console.log(nextDate, "nextDate");
  return nextDate;
}

export function calculateNextOccurrence( // Calculate the next occurrence date based on the given date and recurring interval
  date: Date,
  recurringInterval: keyof typeof RecurringIntervalEnum
) {
  const base = new Date(date);
  base.setHours(0, 0, 0, 0);

  switch (recurringInterval) {
    case RecurringIntervalEnum.DAILY:
      return addDays(base, 1);
    case RecurringIntervalEnum.WEEKLY:
      return addWeeks(base, 1);
    case RecurringIntervalEnum.MONTHLY:
      return addMonths(base, 1);
    case RecurringIntervalEnum.YEARLY:
      return addYears(base, 1);
    default:
      return base;
  }
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}