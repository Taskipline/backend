import express from "express";
import {
  forgotPassword,
  githubAuth,
  googleAuth,
  refreshAccessToken,
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
 *  tags:
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Signup successful. Verification email sent."
 *       '400':
 *         description: Bad Request - Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Invalid input data."
 *               statusCode: 400
 *               code: 10001
 *       '409':
 *         description: Conflict - An account with this email already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "An account with this email already exists."
 *               statusCode: 409
 *               code: 10002
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Account verified successfully."
 *       '400':
 *         description: Bad Request - Invalid or expired verification token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Invalid or expired verification token."
 *               statusCode: 400
 *               code: 10003
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Verification email resent successfully."
 *       '400':
 *         description: Bad Request - Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Invalid email format."
 *               statusCode: 400
 *               code: 10004
 *       '404':
 *         description: Not Found - Account not found or already verified.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Account not found or already verified."
 *               statusCode: 404
 *               code: 10005
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               message: "Sign-in successful."
 *               accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               user:
 *                 id: "65f23d9e12345a6789b0cde1"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 email: "john.doe@example.com"
 *                 profilePicture: "https://example.com/profile.jpg"
 *                 preferences:
 *                   emailNotifications: true
 *                   enableAIFeatures: true
 *       '401':
 *         description: Unauthorized - Invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Invalid email or password."
 *               statusCode: 401
 *               code: 11001
 *       '403':
 *         description: Forbidden - Account not verified.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Account not verified. Please check your email for verification instructions."
 *               statusCode: 403
 *               code: 11002
 */
router.post("/signin", tryCatch(signin));

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh an access token
 *     tags: [Authentication]
 *     description: Issues a new access token using the refresh token from the cookie.
 *     responses:
 *       '200':
 *         description: Access token refreshed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *             example:
 *               accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       '401':
 *         description: Unauthorized - No valid refresh token found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Invalid refresh token."
 *               statusCode: 401
 *               code: 11003
 */
router.post("/refresh-token", tryCatch(refreshAccessToken));

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Sign-out successful."
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "If an account with this email exists, a password reset link has been sent."
 *       '400':
 *         description: Bad Request - Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Invalid email format."
 *               statusCode: 400
 *               code: 10006
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Password has been reset successfully."
 *       '400':
 *         description: Bad Request - Invalid or expired password reset token, or passwords do not match.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Invalid or expired password reset token."
 *               statusCode: 400
 *               code: 10007
 *       '404':
 *         description: Not Found - User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "User not found."
 *               statusCode: 404
 *               code: 10008
 */
router.patch("/reset-password/:token", tryCatch(resetPassword));

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Authenticate with Google
 *     tags: [Authentication]
 *     description: Verifies Google ID token and signs in or registers user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Google ID token from client-side authentication
 *     responses:
 *       '200':
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               message: "Google sign-in successful."
 *               accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               user:
 *                 id: "65f23d9e12345a6789b0cde1"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 email: "john.doe@gmail.com"
 *                 profilePicture: "https://lh3.googleusercontent.com/a-/..."
 *                 preferences:
 *                   emailNotifications: true
 *                   enableAIFeatures: true
 *       '400':
 *         description: Bad Request - Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Invalid Google token."
 *               statusCode: 400
 *               code: 11005
 *       '401':
 *         description: Unauthorized - Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Google authentication failed."
 *               statusCode: 401
 *               code: 11006
 */
router.post("/google", tryCatch(googleAuth));

/**
 * @swagger
 * /auth/github:
 *   post:
 *     summary: Authenticate with Github
 *     tags: [Authentication]
 *     description: Verifies Github code and signs in or registers user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: Github code from client-side authentication flow
 *     responses:
 *       '200':
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               message: "GitHub sign-in successful"
 *               accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               user:
 *                 id: "65f23d9e12345a6789b0cde1"
 *                 firstName: "Ayomide"
 *                 lastName: "Akintan"
 *                 email: "emzyakints2005@gmail.com"
 *                 profilePicture: "https://avatars.githubusercontent.com/u/115672480?v=4"
 *                 preferences:
 *                   emailNotifications: true
 *                   enableAIFeatures: true
 *       '400':
 *         description: Bad Request - Invalid code or missing email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Could not retrieve email from GitHub."
 *               statusCode: 400
 *               code: 11003
 *       '401':
 *         description: Unauthorized - Failed to exchange code for token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Failed to exchange code for access token."
 *               statusCode: 401
 *               code: 11017
 */
router.post("/github", tryCatch(githubAuth));

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthResponse:
 *       type: object
 *       description: Response returned after successful authentication
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *           example: Login successful
 *         accessToken:
 *           type: string
 *           description: JWT access token for authenticated requests
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         user:
 *           $ref: '#/components/schemas/User'
 */
