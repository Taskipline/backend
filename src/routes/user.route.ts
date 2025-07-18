import { Router } from "express";
import {
  changePassword,
  updateUserPreferences,
  updateUserProfile,
} from "../controllers/user.controller";
import { tryCatch } from "../utils/tryCatch";
import authenticatedUserMiddleware from "../middleware/auth.middleware";

const userRouter = Router();

// All routes in this file are protected and require a valid access token
userRouter.use(authenticatedUserMiddleware);

/**
 * @swagger
 * /user/profile:
 *   patch:
 *     summary: Update user profile
 *     tags: [User Settings]
 *     security:
 *       - bearerAuth: []
 *     description: Updates the first name and/or last name of the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *     responses:
 *       '200':
 *         description: Profile updated successfully.
 *       '401':
 *         description: Unauthorized - Invalid or missing token.
 */
userRouter.patch("/profile", tryCatch(updateUserProfile));

/**
 * @swagger
 * /user/preferences:
 *   patch:
 *     summary: Update user preferences
 *     tags: [User Settings]
 *     security:
 *       - bearerAuth: []
 *     description: Updates the notification and AI feature preferences for the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailNotifications:
 *                 type: boolean
 *                 example: false
 *               enableAIFeatures:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       '200':
 *         description: Preferences updated successfully.
 *       '401':
 *         description: Unauthorized - Invalid or missing token.
 */
userRouter.patch("/preferences", tryCatch(updateUserPreferences));

/**
 * @swagger
 * /user/change-password:
 *   patch:
 *     summary: Change user password
 *     tags: [User Settings]
 *     security:
 *       - bearerAuth: []
 *     description: Allows an authenticated user to change their password by providing their old password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - confirmNewPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 example: myOldPassword123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: myNewStrongPassword456
 *               confirmNewPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: myNewStrongPassword456
 *     responses:
 *       '200':
 *         description: Password changed successfully.
 *       '401':
 *         description: Unauthorized - Incorrect old password.
 */
userRouter.patch("/change-password", tryCatch(changePassword));

export default userRouter;
