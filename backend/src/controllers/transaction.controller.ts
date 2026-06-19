import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import {
  bulkDeleteTransactionSchema,
  bulkTransactionSchema,
  createTransactionSchema,
  transactionIdSchema,
  updateTransactionSchema,
} from "../validators/transaction.validator";
import {
  bulkDeleteTransactionService,
  bulkTransactionService,
  createTransactionService,
  deleteTransactionService,
  duplicateTransactionService,
  getAllTransactionService,
  getTransactionByIdService,
  scanReceiptService,
  updateTransactionService,
} from "../services/transaction.service";
import { TransactionTypeEnum } from "../models/transaction.model";

const getAuthUserId = (req: Request): string | undefined => {
  const user: any = (req as any).user;
  return user?.id ?? user?._id?.toString?.() ?? user?._id ?? user?.userId;
};

const parsePositiveInt = (
  value: unknown,
  fallback: number,
  maxValue?: number
): number => {
  const parsed = parseInt(String(value), 10);

  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }

  if (maxValue) {
    return Math.min(parsed, maxValue);
  }

  return parsed;
};

export const createTransactionController = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = createTransactionSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Validation failed",
        errors: parsed.error.flatten(),
      });
    }

    const userId = getAuthUserId(req);

    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Unauthorized",
      });
    }

    const transaction = await createTransactionService(parsed.data, userId);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Transaction created successfully",
      transaction,
    });
  }
);

export const getAllTransactionController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getAuthUserId(req);

    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Unauthorized",
      });
    }

    const filters = {
      keyword: req.query.keyword as string | undefined,
      type: req.query.type as keyof typeof TransactionTypeEnum | undefined,
      recurringStatus: req.query.recurringStatus as
        | "RECURRING"
        | "NON_RECURRING"
        | undefined,
    };

    /*
      Supports both:
      /all?pageSize=10&pageNumber=1
      /all?limit=10&pageNumber=1
    */
    const pagination = {
      pageSize: parsePositiveInt(
        req.query.pageSize || req.query.limit,
        20,
        100
      ),
      pageNumber: parsePositiveInt(req.query.pageNumber, 1),
    };

    const result = await getAllTransactionService(userId, filters, pagination);

    return res.status(HTTPSTATUS.OK).json({
      message: "Transaction fetched successfully",
      ...result,
    });
  }
);

export const getTransactionByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getAuthUserId(req);

    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Unauthorized",
      });
    }

    const transactionId = transactionIdSchema.parse(req.params.id);

    const transaction = await getTransactionByIdService(userId, transactionId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Transaction fetched successfully",
      transaction,
    });
  }
);

export const duplicateTransactionController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getAuthUserId(req);

    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Unauthorized",
      });
    }

    const transactionId = transactionIdSchema.parse(req.params.id);

    const transaction = await duplicateTransactionService(
      userId,
      transactionId
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Transaction duplicated successfully",
      data: transaction,
    });
  }
);

export const updateTransactionController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getAuthUserId(req);

    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Unauthorized",
      });
    }

    const transactionId = transactionIdSchema.parse(req.params.id);
    const body = updateTransactionSchema.parse(req.body);

    const transaction = await updateTransactionService(
      userId,
      transactionId,
      body
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Transaction updated successfully",
      transaction,
    });
  }
);

export const deleteTransactionController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getAuthUserId(req);

    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Unauthorized",
      });
    }

    const transactionId = transactionIdSchema.parse(req.params.id);

    await deleteTransactionService(userId, transactionId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Transaction deleted successfully",
    });
  }
);

export const bulkDeleteTransactionController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getAuthUserId(req);

    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Unauthorized",
      });
    }

    const { transactionIds } = bulkDeleteTransactionSchema.parse(req.body);

    const result = await bulkDeleteTransactionService(userId, transactionIds);

    return res.status(HTTPSTATUS.OK).json({
      message: "Transactions deleted successfully",
      ...result,
    });
  }
);

export const bulkTransactionController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getAuthUserId(req);

    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Unauthorized",
      });
    }

    const { transactions } = bulkTransactionSchema.parse(req.body);

    const result = await bulkTransactionService(userId, transactions);

    return res.status(HTTPSTATUS.OK).json({
      message: "Bulk transactions inserted successfully",
      ...result,
    });
  }
);

export const scanReceiptController = asyncHandler(
  async (req: Request, res: Response) => {
    const file = req.file;

    const result = await scanReceiptService(file);

    return res.status(HTTPSTATUS.OK).json({
      message: result?.error
        ? "Receipt scan failed"
        : "Receipt scanned successfully",
      data: result,
    });
  }
);