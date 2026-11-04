import { describe, it, expect } from "vitest";
import {
  createTransactionSchema,
  bulkTransactionSchema,
  bulkDeleteTransactionSchema,
  transactionIdSchema,
} from "../transaction.validator";
import {
  PaymentMethodEnum,
  RecurringIntervalEnum,
  TransactionTypeEnum,
} from "../../models/transaction.model";

describe("Transaction Validators", () => {
  describe("createTransactionSchema", () => {
    it("should accept valid transaction data", () => {
      const validData = {
        title: "Salary",
        description: "Monthly salary",
        type: TransactionTypeEnum.INCOME,
        amount: 50000,
        category: "Salary",
        date: new Date().toISOString(),
        isRecurring: false,
        paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
      };

      const result = createTransactionSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("Salary");
        expect(result.data.amount).toBe(50000);
        expect(result.data.date).toBeInstanceOf(Date);
      }
    });

    it("should default paymentMethod to CASH if not specified", () => {
      const dataWithoutPayment = {
        title: "Grocery",
        type: TransactionTypeEnum.EXPENSE,
        amount: 250,
        category: "Food",
        date: new Date().toISOString(),
      };

      const result = createTransactionSchema.safeParse(dataWithoutPayment);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.paymentMethod).toBe(PaymentMethodEnum.CASH);
      }
    });

    it("should reject negative or zero amount", () => {
      const invalidAmountData = {
        title: "Coffee",
        type: TransactionTypeEnum.EXPENSE,
        amount: -50,
        category: "Food",
        date: new Date().toISOString(),
      };

      const result = createTransactionSchema.safeParse(invalidAmountData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid transaction type", () => {
      const invalidTypeData = {
        title: "Transfer",
        type: "INVESTMENT" as any,
        amount: 1000,
        category: "Invest",
        date: new Date().toISOString(),
      };

      const result = createTransactionSchema.safeParse(invalidTypeData);
      expect(result.success).toBe(false);
    });

    it("should accept recurring transaction with valid recurringInterval", () => {
      const recurringData = {
        title: "Netflix Subscription",
        type: TransactionTypeEnum.EXPENSE,
        amount: 649,
        category: "Entertainment",
        date: new Date().toISOString(),
        isRecurring: true,
        recurringInterval: RecurringIntervalEnum.MONTHLY,
      };

      const result = createTransactionSchema.safeParse(recurringData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.recurringInterval).toBe(RecurringIntervalEnum.MONTHLY);
      }
    });
  });

  describe("bulkTransactionSchema", () => {
    it("should validate an array of valid transactions", () => {
      const transactions = [
        {
          title: "Dinner",
          type: TransactionTypeEnum.EXPENSE,
          amount: 1200,
          category: "Food",
          date: new Date().toISOString(),
          paymentMethod: PaymentMethodEnum.CARD,
        },
        {
          title: "Freelance",
          type: TransactionTypeEnum.INCOME,
          amount: 15000,
          category: "Work",
          date: new Date().toISOString(),
          paymentMethod: PaymentMethodEnum.BANK_TRANSFER,
        },
      ];

      const result = bulkTransactionSchema.safeParse({ transactions });
      expect(result.success).toBe(true);
    });

    it("should reject empty transaction list", () => {
      const result = bulkTransactionSchema.safeParse({ transactions: [] });
      expect(result.success).toBe(false);
    });
  });

  describe("bulkDeleteTransactionSchema", () => {
    it("should accept valid 24-character hexadecimal MongoDB ObjectIds", () => {
      const payload = {
        transactionIds: [
          "64f1a2b3c4d5e6f7a8b9c0d1",
          "64f1a2b3c4d5e6f7a8b9c0d2",
        ],
      };

      const result = bulkDeleteTransactionSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("should reject invalid ObjectId lengths", () => {
      const payload = {
        transactionIds: ["short-id", "123"],
      };

      const result = bulkDeleteTransactionSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it("should reject empty transactionIds list", () => {
      const result = bulkDeleteTransactionSchema.safeParse({
        transactionIds: [],
      });
      expect(result.success).toBe(false);
    });
  });

  describe("transactionIdSchema", () => {
    it("should validate non-empty string IDs", () => {
      expect(transactionIdSchema.safeParse("abc123xyz").success).toBe(true);
      expect(transactionIdSchema.safeParse("").success).toBe(false);
      expect(transactionIdSchema.safeParse("   ").success).toBe(false);
    });
  });
});
