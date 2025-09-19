import express from "express";
import { joinWaitlist, getWaitlist } from "../controllers/waitlist.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Waitlist
 *   description: |
 *     Endpoints for managing the application waitlist.
 *
 *     ## About the Waitlist
 *     The waitlist allows users to express interest in the application before they can register.
 *     These endpoints handle:
 *     - Joining the waitlist with an email address
 *     - Retrieving the list of waitlist entries (admin access)
 *
 *     ## No Authentication Required
 *     The join waitlist endpoint is public and doesn't require authentication.
 *     The get waitlist endpoint would typically be protected in production.
 */

/**
 * @swagger
 * /waitlist:
 *   post:
 *     summary: Join the waitlist
 *     tags: [Waitlist]
 *     description: |
 *       Adds a new email to the waitlist.
 *
 *       When a user submits their email:
 *       1. The system validates the email format
 *       2. Checks if the email is already on the waitlist
 *       3. Adds the email if it's new
 *       4. Sends a confirmation email to the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WaitlistRequest'
 *     responses:
 *       '201':
 *         description: Successfully joined the waitlist.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WaitlistJoinResponse'
 *       '400':
 *         description: Invalid email format.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               validationError:
 *                 value:
 *                   message: Invalid email format
 *                   statusCode: 400
 *                   code: 13000
 *       '409':
 *         description: Email already on the waitlist.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               duplicateEmail:
 *                 value:
 *                   message: Email already on the waitlist
 *                   statusCode: 409
 *                   code: 12001
 *       '500':
 *         description: Server error processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               serverError:
 *                 value:
 *                   message: Error joining waitlist
 *                   statusCode: 500
 *                   code: 10000
 */
router.post("/", joinWaitlist);

/**
 * @swagger
 * /waitlist:
 *   get:
 *     summary: Get the waitlist
 *     tags: [Waitlist]
 *     description: |
 *       Retrieves the full list of emails on the waitlist, sorted by most recent first.
 *
 *       Note: In production, this endpoint should be protected and accessible only by administrators.
 *       Currently, it's open for development purposes.
 *     responses:
 *       '200':
 *         description: A list of waitlist entries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WaitlistEntry'
 *       '500':
 *         description: Server error fetching the waitlist.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               serverError:
 *                 value:
 *                   message: Error fetching waitlist
 *                   statusCode: 500
 *                   code: 10000
 */
router.get("/", getWaitlist);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     WaitlistRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email address to join the waitlist
 *           example: user@example.com
 *       example:
 *         email: user@example.com
 *
 *     WaitlistJoinResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Confirmation message
 *           example: Successfully joined the waitlist
 *       example:
 *         message: Successfully joined the waitlist
 *
 *     WaitlistEntry:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *           example: 6087e35b3f9d3a001f37d123
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: user@example.com
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user joined the waitlist
 *           example: 2023-01-15T08:30:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the entry was last updated
 *           example: 2023-01-15T08:30:00.000Z
 *       example:
 *         _id: 6087e35b3f9d3a001f37d123
 *         email: user@example.com
 *         createdAt: 2023-01-15T08:30:00.000Z
 *         updatedAt: 2023-01-15T08:30:00.000Z
 */
