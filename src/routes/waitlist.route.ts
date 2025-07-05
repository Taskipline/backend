import express from "express";
import { joinWaitlist, getWaitlist } from "../controllers/waitlist.controller";

const router = express.Router();

/**
 * @swagger
 * /waitlist:
 *   post:
 *     summary: Join the waitlist
 *     description: Adds a new email to the waitlist.
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
 *                 description: The user's email address.
 *     responses:
 *       '201':
 *         description: Successfully joined the waitlist.
 *       '400':
 *         description: Invalid email format.
 *       '409':
 *         description: Email already on the waitlist.
 */
router.post("/", joinWaitlist);

/**
 * @swagger
 * /waitlist:
 *   get:
 *     summary: Get the waitlist
 *     description: Retrieves the full list of emails on the waitlist.
 *     responses:
 *       '200':
 *         description: A list of waitlist entries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                     format: email
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 */
router.get("/", getWaitlist);

export default router;
