import mongoose from "mongoose";
import UserModel from "../models/user.model";
import { NotFoundException, UnauthorizedException } from "../utils/app-error";
import {
  LoginSchemaType,
  RegisterSchemaType,
} from "../validators/auth.validator";
import ReportSettingModel, {
  ReportFrequencyEnum,
} from "../models/report-setting.model";
import { calulateNextReportDate } from "../utils/helper";
import { signJwtToken } from "../utils/jwt";

export const registerService = async (body: RegisterSchemaType) => {
  const { email } = body;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) throw new UnauthorizedException("User already exists");

  let createdUser: any;

  try {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const newUser = new UserModel({
          ...body,
        });

        await newUser.save({ session });

        const reportSetting = new ReportSettingModel({
          userId: newUser._id,
          frequency: ReportFrequencyEnum.MONTHLY,
          isEnabled: true,
          nextReportDate: calulateNextReportDate(),
          lastSentDate: null,
        });
        await reportSetting.save({ session });

        createdUser = newUser.omitPassword();
      });
    } finally {
      await session.endSession();
    }
  } catch (txError: any) {
    if (
      txError?.message?.includes("replica set") ||
      txError?.message?.includes("Transaction numbers are only allowed")
    ) {
      const newUser = new UserModel({
        ...body,
      });

      await newUser.save();

      const reportSetting = new ReportSettingModel({
        userId: newUser._id,
        frequency: ReportFrequencyEnum.MONTHLY,
        isEnabled: true,
        nextReportDate: calulateNextReportDate(),
        lastSentDate: null,
      });
      await reportSetting.save();

      createdUser = newUser.omitPassword();
    } else {
      throw txError;
    }
  }

  return { user: createdUser };
};

export const loginService = async (body: LoginSchemaType) => {
  const { email, password } = body;
  const user = await UserModel.findOne({ email });
  if (!user) throw new NotFoundException("Email/password not found");

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid)
    throw new UnauthorizedException("Invalid email/password");

  const { token, expiresAt } = signJwtToken({ userId: user.id });

  const reportSetting = await ReportSettingModel.findOne(
    {
      userId: user.id,
    },
    { _id: 1, frequency: 1, isEnabled: 1 }
  ).lean();

  return {
    user: user.omitPassword(),
    accessToken: token,
    expiresAt,
    reportSetting,
  };
};

export const refreshTokenService = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new NotFoundException("User not found");

  const { token, expiresAt } = signJwtToken({ userId: user.id });

  return {
    accessToken: token,
    expiresAt,
  };
};
