import axios from "axios";
import fs from "node:fs/promises";

import TransactionModel, {
  TransactionTypeEnum,
} from "../models/transaction.model";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import { calculateNextOccurrence } from "../utils/helper";
import {
  CreateTransactionType,
  UpdateTransactionType,
} from "../validators/transaction.validator";
import { genAI, genAIModel } from "../config/google-ai.config";
import { createPartFromBase64, createUserContent } from "@google/genai";
import { receiptPrompt } from "../utils/prompt";

const SUPPORTED_RECEIPT_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
]);

const normalizeMimeType = (mimeType: string) => {
  if (mimeType === "image/jpg") return "image/jpeg";
  return mimeType;
};

const getBase64FromUploadedFile = async (
  file: Express.Multer.File
): Promise<string> => {
  if (file.buffer) {
    return Buffer.from(file.buffer).toString("base64");
  }

  if (!file.path) {
    throw new BadRequestException("Uploaded file path is missing");
  }

  if (/^https?:\/\//i.test(file.path)) {
    const responseData = await axios.get<ArrayBuffer>(file.path, {
      responseType: "arraybuffer",
      timeout: 30000,
    });

    return Buffer.from(responseData.data).toString("base64");
  }

  const localFile = await fs.readFile(file.path);
  return localFile.toString("base64");
};

const extractJsonFromText = (text: string): string => {
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  return jsonMatch ? jsonMatch[0] : cleaned;
};

export const createTransactionService = async (
  body: CreateTransactionType,
  userId: string
) => {
  let nextRecurringDate: Date | null = null;
  const currentDate = new Date();

  const isRecurring = body.isRecurring || false;
  const recurringInterval = isRecurring ? body.recurringInterval || null : null;

  if (isRecurring && recurringInterval) {
    const calculatedDate = calculateNextOccurrence(
      new Date(body.date),
      recurringInterval
    );

    nextRecurringDate =
      calculatedDate < currentDate
        ? calculateNextOccurrence(currentDate, recurringInterval)
        : calculatedDate;
  }

  const transaction = await TransactionModel.create({
    ...body,
    userId,
    category: body.category,
    amount: Number(body.amount),
    date: new Date(body.date),
    isRecurring,
    recurringInterval,
    nextRecurringDate,
    lastProcessed: null,
  });

  return transaction;
};

export const getAllTransactionService = async (
  userId: string,
  filters: {
    keyword?: string;
    type?: keyof typeof TransactionTypeEnum;
    recurringStatus?: "RECURRING" | "NON_RECURRING";
  },
  pagination: {
    pageSize: number;
    pageNumber: number;
  }
) => {
  const { keyword, type, recurringStatus } = filters;

  const filterConditions: Record<string, any> = {
    userId,
  };

  if (keyword) {
    filterConditions.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { category: { $regex: keyword, $options: "i" } },
    ];
  }

  if (type) {
    filterConditions.type = type;
  }

  if (recurringStatus === "RECURRING") {
    filterConditions.isRecurring = true;
  }

  if (recurringStatus === "NON_RECURRING") {
    filterConditions.isRecurring = false;
  }

  const pageSize = Math.max(1, Math.min(Number(pagination.pageSize) || 20, 100));
  const pageNumber = Math.max(1, Number(pagination.pageNumber) || 1);
  const skip = (pageNumber - 1) * pageSize;

  const [transactions, totalCount] = await Promise.all([
    TransactionModel.find(filterConditions)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(pageSize),
    TransactionModel.countDocuments(filterConditions),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    transactions,
    pagination: {
      pageSize,
      pageNumber,
      totalCount,
      totalPages,
      skip,
    },
  };
};

export const getTransactionByIdService = async (
  userId: string,
  transactionId: string
) => {
  const transaction = await TransactionModel.findOne({
    _id: transactionId,
    userId,
  });

  if (!transaction) {
    throw new NotFoundException("Transaction not found");
  }

  return transaction;
};

export const duplicateTransactionService = async (
  userId: string,
  transactionId: string
) => {
  const transaction = await TransactionModel.findOne({
    _id: transactionId,
    userId,
  });

  if (!transaction) {
    throw new NotFoundException("Transaction not found");
  }

  const original = transaction.toObject() as any;

  delete original._id;
  delete original.id;
  delete original.__v;
  delete original.createdAt;
  delete original.updatedAt;

  const duplicated = await TransactionModel.create({
    ...original,
    userId,
    title: `Duplicate - ${transaction.title}`,
    description: transaction.description
      ? `${transaction.description} (Duplicate)`
      : "Duplicated transaction",
    isRecurring: false,
    recurringInterval: null,
    nextRecurringDate: null,
    lastProcessed: null,
  });

  return duplicated;
};

export const updateTransactionService = async (
  userId: string,
  transactionId: string,
  body: UpdateTransactionType
) => {
  const existingTransaction = await TransactionModel.findOne({
    _id: transactionId,
    userId,
  });

  if (!existingTransaction) {
    throw new NotFoundException("Transaction not found");
  }

  const now = new Date();

  const isRecurring =
    body.isRecurring !== undefined
      ? body.isRecurring
      : existingTransaction.isRecurring;

  const date =
    body.date !== undefined ? new Date(body.date) : existingTransaction.date;

  const recurringInterval = isRecurring
    ? body.recurringInterval !== undefined
      ? body.recurringInterval
      : existingTransaction.recurringInterval
    : null;

  let nextRecurringDate: Date | null = null;

  if (isRecurring && recurringInterval) {
    const calculatedDate = calculateNextOccurrence(date, recurringInterval);

    nextRecurringDate =
      calculatedDate < now
        ? calculateNextOccurrence(now, recurringInterval)
        : calculatedDate;
  }

  existingTransaction.set({
    ...(body.title !== undefined && { title: body.title }),
    ...(body.description !== undefined && { description: body.description }),
    ...(body.category !== undefined && { category: body.category }),
    ...(body.type !== undefined && { type: body.type }),
    ...(body.paymentMethod !== undefined && {
      paymentMethod: body.paymentMethod,
    }),
    ...(body.amount !== undefined && { amount: Number(body.amount) }),

    date,
    isRecurring,
    recurringInterval,
    nextRecurringDate,
  });

  await existingTransaction.save();

  return existingTransaction;
};

export const deleteTransactionService = async (
  userId: string,
  transactionId: string
) => {
  const deleted = await TransactionModel.findOneAndDelete({
    _id: transactionId,
    userId,
  });

  if (!deleted) {
    throw new NotFoundException("Transaction not found");
  }

  return deleted;
};

export const bulkDeleteTransactionService = async (
  userId: string,
  transactionIds: string[]
) => {
  const result = await TransactionModel.deleteMany({
    _id: { $in: transactionIds },
    userId,
  });

  if (result.deletedCount === 0) {
    throw new NotFoundException("No transactions found");
  }

  return {
    success: true,
    deletedCount: result.deletedCount,
  };
};

export const bulkTransactionService = async (
  userId: string,
  transactions: CreateTransactionType[]
) => {
  const bulkOps = transactions.map((tx) => ({
    insertOne: {
      document: {
        ...tx,
        userId,
        amount: Number(tx.amount),
        date: new Date(tx.date),
        isRecurring: false,
        nextRecurringDate: null,
        recurringInterval: null,
        lastProcessed: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  }));

  const result = await TransactionModel.bulkWrite(bulkOps, {
    ordered: true,
  });

  return {
    insertedCount: result.insertedCount,
    success: true,
  };
};

export const scanReceiptService = async (
  file: Express.Multer.File | undefined
) => {
  if (!file) {
    throw new BadRequestException("No file uploaded");
  }

  try {
    const normalizedMimeType = normalizeMimeType(file.mimetype);

    if (!SUPPORTED_RECEIPT_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException(
        `Unsupported receipt file type: ${file.mimetype}`
      );
    }

    const base64String = await getBase64FromUploadedFile(file);

    if (!base64String) {
      throw new BadRequestException("Could not process uploaded file");
    }

    const result = await genAI.models.generateContent({
      model: genAIModel,
      contents: [
        createUserContent([
          receiptPrompt,
          createPartFromBase64(base64String, normalizedMimeType),
        ]),
      ],
      config: {
        temperature: 0,
        topP: 1,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            amount: { type: "number" },
            date: { type: "string" },
            description: { type: "string" },
            category: { type: "string" },
            paymentMethod: { type: "string" },
            type: { type: "string" },
          },
          required: ["amount", "date"],
        },
      },
    });

    const rawText = result.text ?? "";
    const cleanedText = extractJsonFromText(rawText);

    if (!cleanedText) {
      return {
        error: "Could not read receipt content",
      };
    }

    let data: any;

    try {
      data = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Receipt JSON parse failed:", {
        rawText,
        cleanedText,
        parseError,
      });

      return {
        error: "Could not parse receipt data",
      };
    }

    if (data.amount === undefined || data.amount === null || !data.date) {
      return {
        error: "Receipt missing required information",
      };
    }

    return {
      title: data.title || "Receipt",
      amount: Number(data.amount),
      date: data.date,
      description: data.description || "",
      category: data.category || "Other",
      paymentMethod: data.paymentMethod || "Other",
      type: data.type || "EXPENSE",
      receiptUrl: file.path || "",
    };
  } catch (error: any) {
  const errorMessage = error?.message || "";

  console.error("Receipt scanning failed:", {
    message: error?.message,
    stack: error?.stack,
    file: {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
    },
  });

  if (
    errorMessage.includes("429") ||
    errorMessage.includes("RESOURCE_EXHAUSTED") ||
    errorMessage.includes("Quota exceeded")
  ) {
    return {
      error:
        "Gemini API quota exceeded. Upload is working, but AI scanning is blocked because your Gemini API key has no available quota for this model. Change the model, wait for quota reset, or enable billing in Google AI Studio.",
    };
  }

  return {
    error:
      process.env.NODE_ENV === "production"
        ? "Receipt scanning service unavailable"
        : error?.message || "Receipt scanning service unavailable",
  };
};
}