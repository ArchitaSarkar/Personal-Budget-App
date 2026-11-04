import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { HTTPSTATUS } from "../config/http.config";
import { Env } from "../config/env.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import {
  loginService,
  refreshTokenService,
  registerService,
} from "../services/auth.service";

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse(req.body);

    const result = await registerService(body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User registered successfully",
      data: result,
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = loginSchema.parse({
      ...req.body,
    });
    const { user, accessToken, expiresAt, reportSetting } =
      await loginService(body);

    return res.status(HTTPSTATUS.OK).json({
      message: "User logged in successfully",
      user,
      accessToken,
      expiresAt,
      reportSetting,
    });
  }
);

export const refreshTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    let payload: any;
    try {
      payload = jwt.verify(token, Env.JWT_SECRET, {
        ignoreExpiration: true,
      });
    } catch (err) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Invalid token",
      });
    }

    if (!payload?.userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Invalid token payload",
      });
    }

    const result = await refreshTokenService(payload.userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Token refreshed successfully",
      ...result,
    });
  }
);

export const logoutController = asyncHandler(
  async (req: Request, res: Response) => {
    return res.status(HTTPSTATUS.OK).json({
      message: "Logged out successfully",
    });
  }
);
