import express from "express";
import {
  resendVerificationEmail,
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

export default router;
