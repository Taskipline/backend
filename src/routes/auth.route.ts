import express from "express";
import {
  forgotPassword,
  refreshAccessToken,
  refreshToken,
  resendVerificationEmail,
  resetPassword,
  signin,
  signout,
  signup,
  verifyAccount,
} from "../controllers/auth.controller";
import { tryCatch } from "../utils/tryCatch";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and account management
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     description: Creates a new user account and sends a verification email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: strongpassword123
 *     responses:
 *       '201':
 *         description: Signup successful. A verification email has been sent.
 *       '400':
 *         description: Bad Request - Invalid input data.
 *       '409':
 *         description: Conflict - An account with this email already exists.
 */
router.post("/signup", tryCatch(signup));

/**
 * @swagger
 * /auth/verify/{token}:
 *   get:
 *     summary: Verify a user's account
 *     tags: [Authentication]
 *     description: Verifies a user's email address using the token from the verification email.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The verification token sent to the user's email.
 *     responses:
 *       '200':
 *         description: Account verified successfully.
 *       '400':
 *         description: Bad Request - Invalid or expired verification token.
 */
router.get("/verify/:token", tryCatch(verifyAccount));

/**
 * @swagger
 * /auth/resend-verification:
 *   post:
 *     summary: Resend the account verification email
 *     tags: [Authentication]
 *     description: Sends a new verification link to a user's email if their account is not yet verified.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *     responses:
 *       '200':
 *         description: If an account with this email exists and is not verified, a new verification link has been sent.
 *       '400':
 *         description: Bad Request - Invalid input data.
 */
router.post("/resend-verification", tryCatch(resendVerificationEmail));

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Sign in a user
 *     tags: [Authentication]
 *     description: Authenticates a user and returns an access token and user info. A refresh token is sent in a secure cookie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: strongpassword123
 *     responses:
 *       '200':
 *         description: Sign-in successful.
 *       '401':
 *         description: Unauthorized - Invalid credentials.
 *       '403':
 *         description: Forbidden - Account not verified.
 */
router.post("/signin", tryCatch(signin));

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh an access token
 *     tags: [Authentication]
 *     description: Issues a new access token using the refresh token from the cookie.
 *     responses:
 *       '200':
 *         description: Access token refreshed successfully.
 *       '401':
 *         description: Unauthorized - No valid refresh token found.
 */
router.post("/refresh", tryCatch(refreshToken));

/**
 * @swagger
 * /auth/signout:
 *   post:
 *     summary: Sign out a user
 *     tags: [Authentication]
 *     description: Clears the user's session by invalidating the refresh token.
 *     responses:
 *       '200':
 *         description: Sign-out successful.
 */
router.post("/signout", tryCatch(signout));

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset
 *     tags: [Authentication]
 *     description: Sends a password reset link to the user's email if the account exists.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *     responses:
 *       '200':
 *         description: If an account with this email exists, a password reset link has been sent.
 *       '400':
 *         description: Bad Request - Invalid input data.
 */
router.post("/forgot-password", tryCatch(forgotPassword));

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   patch:
 *     summary: Reset a user's password
 *     tags: [Authentication]
 *     description: Sets a new password for the user using the token from the reset link.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The password reset token from the email link.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - confirmPassword
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: newStrongPassword456
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: newStrongPassword456
 *     responses:
 *       '200':
 *         description: Password has been reset successfully.
 *       '400':
 *         description: Bad Request - Invalid or expired password reset token, or passwords do not match.
 */
router.patch("/reset-password/:token", tryCatch(resetPassword));

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     description: Issues a new access token using a valid refresh token from cookies or Authorization header.
 *     responses:
 *       '200':
 *         description: New access token issued.
 *       '401':
 *         description: Unauthorized - Missing or invalid refresh token.
 */
router.post("/refresh-token", tryCatch(refreshAccessToken));

export default router;
