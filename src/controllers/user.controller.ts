import { Request, Response } from "express";
import { User } from "../models/user.model";
import {
  changePasswordSchema,
  updatePreferencesSchema,
  updateProfileSchema,
} from "../schemas/user.schema";
import { UnauthorizedError } from "../errors/index.error";
import { ErrorCode } from "../errors/custom.error";

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
