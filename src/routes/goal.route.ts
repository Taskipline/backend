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
 * tags:
 *   name: Goals
 *   description: |
 *     Endpoints for managing user goals.
 *
 *     ## About Goals
 *     Goals are high-level objectives that users want to achieve. Each goal can contain multiple tasks.
 *     These endpoints provide full CRUD functionality for goals:
 *     - Creating new goals with optional linked tasks
 *     - Retrieving all goals or a specific goal with its tasks
 *     - Updating goal details
 *     - Deleting goals (which also removes associated tasks)
 *
 *     ## Authentication Required
 *     All goal endpoints require authentication with a valid JWT token.
 *
 *     ## Goal Status
 *     Goals can have two status values:
 *     - "In Progress" (default)
 *     - "Completed"
 */

/**
 * @swagger
 * /goals:
 *   post:
 *     summary: Create a new goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Creates a new goal for the authenticated user.
 *       Can optionally create and link tasks in the same transaction.
 *
 *       When tasks are included in the request:
 *       1. The goal is created first
 *       2. All tasks are created with references to the goal
 *       3. The goal's tasks array is updated with references to the new tasks
 *       4. The entire operation is atomic (uses MongoDB transaction)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoalCreateRequest'
 *     responses:
 *       '201':
 *         description: Goal created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GoalCreateResponse'
 *       '400':
 *         description: Bad Request - Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               validationError:
 *                 value:
 *                   message: "Title is required"
 *                   statusCode: 400
 *                   code: 13000
 *       '401':
 *         description: Unauthorized - Invalid or missing token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               unauthorized:
 *                 value:
 *                   message: "Not authorized to access this route"
 *                   statusCode: 401
 *                   code: 11000
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
 *     description: |
 *       Retrieves a list of all goals for the authenticated user.
 *
 *       Each goal includes:
 *       - Basic goal information (title, description, etc.)
 *       - A list of associated tasks
 *       - The completion percentage calculated from tasks
 *
 *       Goals are sorted by creation date (newest first).
 *     responses:
 *       '200':
 *         description: A list of goals with completion percentages.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 goals:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GoalWithCompletion'
 *       '401':
 *         description: Unauthorized - Invalid or missing token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *     description: |
 *       Retrieves a single goal by its ID, including:
 *       - All goal details
 *       - Populated tasks array with complete task objects
 *       - Calculated completion percentage based on completed tasks
 *
 *       Only returns goals belonging to the authenticated user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the goal to retrieve.
 *         example: 6087e35b3f9d3a001f37d123
 *     responses:
 *       '200':
 *         description: The requested goal with its tasks and completion percentage.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 goal:
 *                   $ref: '#/components/schemas/GoalWithCompletion'
 *       '401':
 *         description: Unauthorized - Invalid or missing token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Not Found - Goal not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               notFound:
 *                 value:
 *                   message: "Goal not found"
 *                   statusCode: 404
 *                   code: 20001
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
 *     description: |
 *       Updates the properties of an existing goal. Only specified fields will be updated.
 *
 *       You can update:
 *       - Title
 *       - Description (can be set to null to clear it)
 *       - Due date (can be set to null to remove it)
 *       - Status (In Progress or Completed)
 *
 *       Note: To update tasks associated with a goal, use the tasks API endpoints.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the goal to update.
 *         example: 6087e35b3f9d3a001f37d123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoalUpdateRequest'
 *     responses:
 *       '200':
 *         description: Goal updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GoalUpdateResponse'
 *       '400':
 *         description: Bad Request - Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               validationError:
 *                 value:
 *                   message: "Title cannot be empty"
 *                   statusCode: 400
 *                   code: 13000
 *       '401':
 *         description: Unauthorized - Invalid or missing token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Not Found - Goal not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               notFound:
 *                 value:
 *                   message: "Goal not found"
 *                   statusCode: 404
 *                   code: 20001
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
 *     description: |
 *       Deletes a goal and all of its associated tasks. This action is irreversible.
 *
 *       The operation:
 *       1. Verifies the goal exists and belongs to the user
 *       2. Deletes all tasks associated with the goal
 *       3. Deletes the goal itself
 *       4. Uses a MongoDB transaction to ensure data integrity
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the goal to delete.
 *         example: 6087e35b3f9d3a001f37d123
 *     responses:
 *       '200':
 *         description: Goal and associated tasks deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Goal and associated tasks deleted
 *       '401':
 *         description: Unauthorized - Invalid or missing token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Not Found - Goal not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               notFound:
 *                 value:
 *                   message: "Goal not found"
 *                   statusCode: 404
 *                   code: 20001
 */
goalRouter.route("/:id").delete(tryCatch(deleteGoal));

export default goalRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     GoalBase:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the goal
 *           example: Learn Backend Development
 *         description:
 *           type: string
 *           description: Detailed description of the goal
 *           example: Complete the Node.js and MongoDB backend course on Udemy
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: The deadline for completing the goal
 *           example: 2025-12-31T23:59:59.000Z
 *         status:
 *           type: string
 *           enum: [In Progress, Completed]
 *           description: Current status of the goal
 *           default: In Progress
 *           example: In Progress
 *
 *     GoalCreateRequest:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the goal
 *           example: Learn Backend Development
 *         description:
 *           type: string
 *           description: Detailed description of the goal
 *           example: Complete the Node.js and MongoDB backend course on Udemy
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: The deadline for completing the goal
 *           example: 2025-12-31T23:59:59.000Z
 *         tasks:
 *           type: array
 *           description: Initial tasks to create with the goal
 *           items:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Set up project structure
 *                 description: Brief title of the task
 *               description:
 *                 type: string
 *                 example: Initialize Node.js project and install dependencies
 *                 description: Detailed description of the task
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-11-15T23:59:59.000Z
 *                 description: The deadline for completing this task
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 default: medium
 *                 description: Priority level of the task
 *                 example: medium
 *       example:
 *         title: Learn Backend Development
 *         description: Complete the Node.js and MongoDB backend course on Udemy
 *         dueDate: 2025-12-31T23:59:59.000Z
 *         tasks:
 *           - title: Set up project structure
 *             description: Initialize Node.js project and install dependencies
 *             priority: high
 *           - title: Complete MongoDB module
 *             description: Learn how to use MongoDB with Node.js
 *             priority: medium
 *
 *     GoalCreateResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *           example: Goal created successfully
 *         goal:
 *           $ref: '#/components/schemas/Goal'
 *
 *     GoalUpdateRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Updated title of the goal
 *           example: Master Backend Development
 *         description:
 *           type: string
 *           nullable: true
 *           description: Updated description (null to clear)
 *           example: Complete advanced Node.js and MongoDB training
 *         dueDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Updated deadline (null to clear)
 *           example: 2026-01-31T23:59:59.000Z
 *         status:
 *           type: string
 *           enum: [In Progress, Completed]
 *           description: Updated status of the goal
 *           example: Completed
 *       example:
 *         title: Master Backend Development
 *         status: Completed
 *
 *     GoalUpdateResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *           example: Goal updated
 *         goal:
 *           $ref: '#/components/schemas/Goal'
 *
 *     Goal:
 *       allOf:
 *         - $ref: '#/components/schemas/GoalBase'
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: MongoDB ObjectId
 *               example: 6087e35b3f9d3a001f37d123
 *             user:
 *               type: string
 *               description: MongoDB ObjectId of the user who owns this goal
 *               example: 6087e0a93f9d3a001f37d120
 *             tasks:
 *               type: array
 *               description: Array of task IDs associated with this goal
 *               items:
 *                 type: string
 *                 description: MongoDB ObjectId of a task
 *                 example: 6087e45b3f9d3a001f37d124
 *             createdAt:
 *               type: string
 *               format: date-time
 *               description: Timestamp when the goal was created
 *               example: 2023-10-15T14:30:00.000Z
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               description: Timestamp when the goal was last updated
 *               example: 2023-10-20T09:15:00.000Z
 *       example:
 *         _id: 6087e35b3f9d3a001f37d123
 *         title: Learn Backend Development
 *         description: Complete the Node.js and MongoDB backend course on Udemy
 *         dueDate: 2025-12-31T23:59:59.000Z
 *         status: In Progress
 *         user: 6087e0a93f9d3a001f37d120
 *         tasks: [6087e45b3f9d3a001f37d124, 6087e48b3f9d3a001f37d125]
 *         createdAt: 2023-10-15T14:30:00.000Z
 *         updatedAt: 2023-10-20T09:15:00.000Z
 *
 *     GoalWithCompletion:
 *       allOf:
 *         - $ref: '#/components/schemas/Goal'
 *         - type: object
 *           properties:
 *             completionPercentage:
 *               type: number
 *               description: Percentage of tasks that are completed (0-100)
 *               example: 75
 *       example:
 *         _id: 6087e35b3f9d3a001f37d123
 *         title: Learn Backend Development
 *         description: Complete the Node.js and MongoDB backend course on Udemy
 *         dueDate: 2025-12-31T23:59:59.000Z
 *         status: In Progress
 *         user: 6087e0a93f9d3a001f37d120
 *         tasks: [6087e45b3f9d3a001f37d124, 6087e48b3f9d3a001f37d125]
 *         createdAt: 2023-10-15T14:30:00.000Z
 *         updatedAt: 2023-10-20T09:15:00.000Z
 *         completionPercentage: 75
 */
