import { Request, Response } from "express";
import { User } from "../models/user.model";
import {
  changePasswordSchema,
  deleteAccountSchema,
  updatePreferencesSchema,
  updateProfileSchema,
} from "../schemas/user.schema";
import { NotFoundError, UnauthorizedError } from "../errors/index.error";
import { ErrorCode } from "../errors/custom.error";
import mongoose from "mongoose";
import { Task } from "../models/task.model";
import { Goal } from "../models/goal.model";
import { sendAccountDeletionEmail } from "../services/email.service";
import { clearAuthCookies } from "../utils/auth.utils";

/**
 * @description Update user's first and last name
 * @route PATCH /api/v1/user/profile
 * @access Private
 */
export const updateUserProfile = async (req: Request, res: Response) => {
  const { firstName, lastName } = updateProfileSchema.parse(req.body);
  const userId = req.user!.userId;

  const user = await User.findById(userId);

  if (!user) {
    // This case is unlikely if authenticateUser middleware is used, but good for safety
    throw new UnauthorizedError("User not found", ErrorCode.USER_NOT_FOUND);
  }

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;

  await user.save();

  res.status(200).json({
    message: "Profile updated successfully",
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });
};

/**
 * @description Update user's notification and AI preferences
 * @route PATCH /api/v1/user/preferences
 * @access Private
 */
export const updateUserPreferences = async (req: Request, res: Response) => {
  const { emailNotifications, enableAIFeatures } =
    updatePreferencesSchema.parse(req.body);
  const userId = req.user!.userId;

  const user = await User.findById(userId);

  if (!user) {
    throw new UnauthorizedError("User not found", ErrorCode.USER_NOT_FOUND);
  }

  // Check if the boolean value was explicitly passed in the request
  if (typeof emailNotifications === "boolean") {
    user.emailNotifications = emailNotifications;
  }
  if (typeof enableAIFeatures === "boolean") {
    user.enableAIFeatures = enableAIFeatures;
  }

  await user.save();

  res.status(200).json({
    message: "Preferences updated successfully",
    preferences: {
      emailNotifications: user.emailNotifications,
      enableAIFeatures: user.enableAIFeatures,
    },
  });
};

/**
 * @description Change user's password while authenticated
 * @route PATCH /api/v1/user/change-password
 * @access Private
 */
export const changePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = changePasswordSchema.parse(req.body);
  const userId = req.user!.userId;

  // We must select +password to get it from the DB for comparison
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new UnauthorizedError("User not found", ErrorCode.USER_NOT_FOUND);
  }

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError(
      "Incorrect old password",
      ErrorCode.INVALID_CREDENTIALS
    );
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: "Password changed successfully" });
};

export const deleteAccount = async (req: Request, res: Response) => {
  const { password } = deleteAccountSchema.parse(req.body);
  const userId = req.user!.userId;

  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new NotFoundError("User not found", ErrorCode.USER_NOT_FOUND);
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError(
      "Incorrect password",
      ErrorCode.INCORRECT_PASSWORD
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Delete all associated data
    await Task.deleteMany({ user: userId }, { session });
    await Goal.deleteMany({ user: userId }, { session });

    // Delete the user
    await User.findByIdAndDelete(userId, { session });

    await session.commitTransaction();

    // Send a final confirmation email
    sendAccountDeletionEmail(user.email, user.firstName);

    // Clear cookies and send response
    clearAuthCookies(res);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
