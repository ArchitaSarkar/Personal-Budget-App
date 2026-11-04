import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Env } from "./env.config";
import multer from "multer";
import { Request } from "express";

cloudinary.config({
  cloud_name: Env.CLOUDINARY_CLOUD_NAME,
  api_key: Env.CLOUDINARY_API_KEY,
  api_secret: Env.CLOUDINARY_API_SECRET,
});

const STORAGE_PARAMS = {
  folder: "images",
  allowed_formats: ["jpg", "png", "jpeg", "webp"],
  resource_type: "image" as const,
  quality: "auto:good" as const,
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req: Request, file: Express.Multer.File) => {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e6);
    const sanitizedName = (file.originalname || "receipt")
      .split(".")[0]
      .replace(/[^a-zA-Z0-9]/g, "_");

    return {
      ...STORAGE_PARAMS,
      public_id: `receipt_${sanitizedName}_${uniqueSuffix}`,
    };
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (_, file, cb) => {
    const isValid = /^image\/(jpe?g|png|webp|heic|heif)$/i.test(file.mimetype);

    if (!isValid) {
      return cb(new Error("Only image files (JPG, PNG, WebP) are allowed"));
    }

    cb(null, true);
  },
});