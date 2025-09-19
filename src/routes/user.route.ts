import { Router } from "express";
import {
  changePassword,
  deleteAccount,
  updateUserPreferences,
  updateUserProfile,
} from "../controllers/user.controller";
import { tryCatch } from "../utils/tryCatch";
import authenticatedUserMiddleware from "../middleware/auth.middleware";

/**
 * @swagger
 * tags:
 *   name: User Settings
 *   description: |
 *     Endpoints for managing user account settings, profiles, and preferences.
 *
 *     ## Authentication Required
 *     All endpoints in this section require authentication with a valid JWT bearer token.
 *
 *     - **Header**: `Authorization: Bearer YOUR_ACCESS_TOKEN`
 *     - **Token Source**: Obtain tokens from `/auth/signin`, `/auth/google`, or `/auth/github` endpoints
 *     - **Token Refresh**: Use `/auth/refresh` when your token expires
 *     - **Error Responses**: Unauthenticated requests will receive a `401 Unauthorized` response
 *
 *     ## Available Operations
 *     These endpoints allow users to:
 *     - Update profile information (name, etc.)
 *     - Manage notification and feature preferences
 *     - Change account password
 *     - Delete their account
 *
 *     ## Error Handling
 *     All endpoints use standardized error response formats with specific error codes.
 *     Refer to the Error schema for details on possible error responses.
 */ const userRouter = Router();

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
 *     x-security-scopes: ['user']
 *     x-required-auth: true
 *     x-auth-description: >
 *       Requires a valid JWT access token obtained from /auth/signin.
 *       Include the token in the Authorization header as: `Bearer YOUR_ACCESS_TOKEN`.
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       '400':
 *         description: Bad request - Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               validationError:
 *                 value:
 *                   message: Validation failed
 *                   statusCode: 400
 *                   code: 13000
 *       '401':
 *         description: Unauthorized - Invalid or missing token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidToken:
 *                 value:
 *                   message: Invalid authentication token
 *                   statusCode: 401
 *                   code: 11000
 *       '404':
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               userNotFound:
 *                 value:
 *                   message: User not found
 *                   statusCode: 404
 *                   code: 11006
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
 *                 description: Whether to send email notifications
 *                 example: false
 *               enableAIFeatures:
 *                 type: boolean
 *                 description: Whether to enable AI-powered features
 *                 example: true
 *     responses:
 *       '200':
 *         description: Preferences updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPreferencesResponse'
 *       '400':
 *         description: Bad request - Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               validationError:
 *                 value:
 *                   message: Validation failed
 *                   statusCode: 400
 *                   code: 13000
 *       '401':
 *         description: Unauthorized - Invalid or missing token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidToken:
 *                 value:
 *                   message: Invalid authentication token
 *                   statusCode: 401
 *                   code: 11000
 *       '404':
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               userNotFound:
 *                 value:
 *                   message: User not found
 *                   statusCode: 404
 *                   code: 11006
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
 *                 description: Current password for verification
 *                 example: myOldPassword123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: New password (minimum 8 characters)
 *                 example: myNewStrongPassword456
 *               confirmNewPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: Confirmation of new password (must match newPassword)
 *                 example: myNewStrongPassword456
 *     responses:
 *       '200':
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PasswordChangeResponse'
 *       '400':
 *         description: Bad request - Invalid input data or passwords don't match.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               validationError:
 *                 value:
 *                   message: Validation failed
 *                   statusCode: 400
 *                   code: 13000
 *               passwordsDoNotMatch:
 *                 value:
 *                   message: New password and confirmation do not match
 *                   statusCode: 400
 *                   code: 13000
 *       '401':
 *         description: Unauthorized - Incorrect old password or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               incorrectPassword:
 *                 value:
 *                   message: Current password is incorrect
 *                   statusCode: 401
 *                   code: 11007
 *               googleUser:
 *                 value:
 *                   message: Google-authenticated users cannot change password directly
 *                   statusCode: 401
 *                   code: 11016
 *       '404':
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               userNotFound:
 *                 value:
 *                   message: User not found
 *                   statusCode: 404
 *                   code: 11006
 */
userRouter.patch("/change-password", tryCatch(changePassword));

/**
 * @swagger
 * /user/delete-account:
 *   delete:
 *     summary: Delete user account
 *     tags: [User Settings]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Permanently deletes the authenticated user's account and all associated data.
 *       This action is irreversible and requires the user's current password for confirmation.
 *       All user data, including tasks, goals, and settings will be permanently removed.
 *       An email confirmation will be sent to the user's registered email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Current password for verification
 *                 example: myCurrentPassword123
 *     responses:
 *       '200':
 *         description: Account deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccountDeletionResponse'
 *       '400':
 *         description: Bad request - Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               validationError:
 *                 value:
 *                   message: Validation failed
 *                   statusCode: 400
 *                   code: 13000
 *       '401':
 *         description: Unauthorized - Incorrect password or invalid token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               incorrectPassword:
 *                 value:
 *                   message: Incorrect password
 *                   statusCode: 401
 *                   code: 11007
 *               invalidToken:
 *                 value:
 *                   message: Invalid authentication token
 *                   statusCode: 401
 *                   code: 11000
 *       '404':
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               userNotFound:
 *                 value:
 *                   message: User not found
 *                   statusCode: 404
 *                   code: 11006
 *       '500':
 *         description: Internal server error - Account deletion failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               internalError:
 *                 value:
 *                   message: Failed to delete user account
 *                   statusCode: 500
 *                   code: 10000
 */
userRouter.delete("/delete-account", tryCatch(deleteAccount));

export default userRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       allOf:
 *         - $ref: '#/components/schemas/UserBase'
 *         - type: object
 *           properties:
 *             isVerified:
 *               type: boolean
 *               description: Whether the user has verified their email address
 *               example: true
 *             googleAuth:
 *               type: boolean
 *               description: Whether the user has connected their Google account
 *               example: false
 *             githubAuth:
 *               type: boolean
 *               description: Whether the user has connected their GitHub account
 *               example: false
 *             preferences:
 *               type: object
 *               description: User preference settings
 *               properties:
 *                 emailNotifications:
 *                   type: boolean
 *                   description: Whether the user has enabled email notifications
 *                   example: true
 *                 enableAIFeatures:
 *                   type: boolean
 *                   description: Whether the user has enabled AI-powered features
 *                   example: true
 *             createdAt:
 *               type: string
 *               format: date-time
 *               description: Date and time when the user account was created
 *               example: "2023-09-15T14:30:00Z"
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               description: Date and time when the user account was last updated
 *               example: "2023-09-18T09:45:00Z"
 *
 *     UserProfile:
 *       type: object
 *       description: User profile data for profile update responses
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the user
 *           example: 6127abcdef123456789
 *         firstName:
 *           type: string
 *           description: User's first name
 *           example: John
 *         lastName:
 *           type: string
 *           description: User's last name
 *           example: Doe
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: john.doe@example.com
 *
 *     UserPreferences:
 *       type: object
 *       description: User preference settings
 *       properties:
 *         emailNotifications:
 *           type: boolean
 *           description: Whether the user has enabled email notifications
 *           example: true
 *         enableAIFeatures:
 *           type: boolean
 *           description: Whether the user has enabled AI-powered features
 *           example: true
 *
 *     UserProfileResponse:
 *       type: object
 *       description: Response for user profile update operations
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *           example: Profile updated successfully
 *         user:
 *           $ref: '#/components/schemas/UserProfile'
 *
 *     UserPreferencesResponse:
 *       type: object
 *       description: Response for user preferences update operations
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *           example: Preferences updated successfully
 *         preferences:
 *           $ref: '#/components/schemas/UserPreferences'
 *
 *     PasswordChangeResponse:
 *       type: object
 *       description: Response for password change operations
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *           example: Password changed successfully
 *
 *     AccountDeletionResponse:
 *       type: object
 *       description: Response for account deletion operations
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *           example: Account deleted successfully
 */
