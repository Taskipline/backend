import { Router } from "express";
import {
  createGoal,
  deleteGoal,
  getAllGoals,
  getGoalById,
  updateGoal,
} from "../controllers/goal.controller";
import authenticatedUserMiddleware from "../middleware/auth.middleware";
import { tryCatch } from "../utils/tryCatch";

const goalRouter = Router();

goalRouter.use(authenticatedUserMiddleware);

/**
 * @swagger
 * /goals:
 *   post:
 *     summary: Create a new goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     description: Creates a new goal for the authenticated user. Can optionally create and link tasks in the same transaction.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Learn Backend Development"
 *               description:
 *                 type: string
 *                 example: "Complete the backend course on Udemy."
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-31T23:59:59.000Z"
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Set up project structure"
 *                     description:
 *                       type: string
 *                       example: "Initialize Node.js project and install dependencies."
 *     responses:
 *       '201':
 *         description: Goal created successfully.
 *       '400':
 *         description: Bad Request - Invalid input data.
 *       '401':
 *         description: Unauthorized - Invalid or missing token.
 */
goalRouter.route("/").post(tryCatch(createGoal));

/**
 * @swagger
 * /goals:
 *   get:
 *     summary: Get all goals
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieves a list of all goals for the authenticated user, including completion percentage.
 *     responses:
 *       '200':
 *         description: A list of goals.
 *       '401':
 *         description: Unauthorized - Invalid or missing token.
 */
goalRouter.route("/").get(tryCatch(getAllGoals));

/**
 * @swagger
 * /goals/{id}:
 *   get:
 *     summary: Get a single goal by ID
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieves a single goal by its ID, including its populated tasks and completion percentage.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the goal to retrieve.
 *     responses:
 *       '200':
 *         description: The requested goal.
 *       '401':
 *         description: Unauthorized - Invalid or missing token.
 *       '404':
 *         description: Not Found - Goal not found.
 */
goalRouter.route("/:id").get(tryCatch(getGoalById));

/**
 * @swagger
 * /goals/{id}:
 *   patch:
 *     summary: Update a goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     description: Updates the properties of an existing goal.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the goal to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [In Progress, Completed]
 *     responses:
 *       '200':
 *         description: Goal updated successfully.
 *       '401':
 *         description: Unauthorized - Invalid or missing token.
 *       '404':
 *         description: Not Found - Goal not found.
 */
goalRouter.route("/:id").patch(tryCatch(updateGoal));

/**
 * @swagger
 * /goals/{id}:
 *   delete:
 *     summary: Delete a goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     description: Deletes a goal and all of its associated tasks. This action is irreversible.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the goal to delete.
 *     responses:
 *       '200':
 *         description: Goal and associated tasks deleted successfully.
 *       '401':
 *         description: Unauthorized - Invalid or missing token.
 *       '404':
 *         description: Not Found - Goal not found.
 */
goalRouter.route("/:id").delete(tryCatch(deleteGoal));

export default goalRouter;
