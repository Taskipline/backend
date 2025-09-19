import { Router } from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from "../controllers/task.controller";
import authenticatedUserMiddleware from "../middleware/auth.middleware";
import { tryCatch } from "../utils/tryCatch";

const taskRouter = Router();

taskRouter.use(authenticatedUserMiddleware);

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: |
 *     Endpoints for managing user tasks.
 *
 *     ## About Tasks
 *     Tasks are actionable items that can exist independently or be linked to goals.
 *     These endpoints provide full CRUD functionality for tasks:
 *     - Creating standalone or goal-linked tasks
 *     - Retrieving all tasks or a specific task
 *     - Updating task details, completion status, or goal association
 *     - Deleting tasks (automatically updates associated goals)
 *
 *     ## Authentication Required
 *     All task endpoints require authentication with a valid JWT token.
 *
 *     ## Task Priorities
 *     Tasks can have three priority levels:
 *     - "low" - Low priority tasks
 *     - "medium" - Medium priority tasks (default)
 *     - "high" - High priority tasks
 *
 *     ## Goal Association
 *     Tasks can be:
 *     - Standalone (no goal association)
 *     - Linked to a goal (contributes to goal completion percentage)
 *     - Moved between goals (automatically updates both goals)
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Creates a new task. Can be a standalone task or linked to an existing goal.
 *
 *       When creating a goal-linked task:
 *       1. The system verifies the goal exists and belongs to the user
 *       2. Creates the task with a reference to the goal
 *       3. Updates the goal's tasks array to include the new task
 *       4. Uses a MongoDB transaction to ensure data integrity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskCreateRequest'
 *     responses:
 *       '201':
 *         description: Task created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskCreateResponse'
 *       '400':
 *         description: Bad Request - Invalid input data or goal not found.
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
 *               goalError:
 *                 value:
 *                   message: "Goal not found or you do not have permission to access it"
 *                   statusCode: 400
 *                   code: 20001
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
taskRouter.route("/").post(tryCatch(createTask));

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Retrieves a list of all tasks for the authenticated user.
 *
 *       Tasks are sorted by creation date (newest first).
 *
 *       Includes both standalone tasks and tasks that are linked to goals.
 *     responses:
 *       '200':
 *         description: A list of tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       '401':
 *         description: Unauthorized - Invalid or missing token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
taskRouter.route("/").get(tryCatch(getAllTasks));

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a single task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Retrieves a single task by its ID.
 *
 *       Only returns tasks belonging to the authenticated user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the task to retrieve.
 *         example: 6087e45b3f9d3a001f37d124
 *     responses:
 *       '200':
 *         description: The requested task.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       '401':
 *         description: Unauthorized - Invalid or missing token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Not Found - Task not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               notFound:
 *                 value:
 *                   message: "Task not found"
 *                   statusCode: 404
 *                   code: 30001
 */
taskRouter.route("/:id").get(tryCatch(getTaskById));

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Updates the properties of an existing task. Only specified fields will be updated.
 *
 *       You can update:
 *       - Basic properties (title, description, due date, priority)
 *       - Completion status (mark as completed/incomplete)
 *       - Goal association (link to a different goal or make standalone)
 *
 *       When changing goal association:
 *       1. The system removes the task from its current goal (if any)
 *       2. Adds the task to the new goal (if specified)
 *       3. Uses a MongoDB transaction to ensure consistency
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the task to update.
 *         example: 6087e45b3f9d3a001f37d124
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskUpdateRequest'
 *     responses:
 *       '200':
 *         description: Task updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskUpdateResponse'
 *       '400':
 *         description: Bad Request - Invalid input data or referenced goal not found.
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
 *               goalError:
 *                 value:
 *                   message: "Goal not found or you do not have permission to access it"
 *                   statusCode: 400
 *                   code: 20001
 *       '401':
 *         description: Unauthorized - Invalid or missing token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Not Found - Task not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               notFound:
 *                 value:
 *                   message: "Task not found"
 *                   statusCode: 404
 *                   code: 30001
 */
taskRouter.route("/:id").patch(tryCatch(updateTask));

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Deletes a task. If the task was linked to a goal, it is removed from that goal's task list.
 *
 *       The operation:
 *       1. Verifies the task exists and belongs to the user
 *       2. If the task is linked to a goal, removes the task reference from the goal
 *       3. Deletes the task
 *       4. Uses a MongoDB transaction to ensure data integrity
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the task to delete.
 *         example: 6087e45b3f9d3a001f37d124
 *     responses:
 *       '200':
 *         description: Task deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task deleted successfully
 *       '401':
 *         description: Unauthorized - Invalid or missing token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Not Found - Task not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               notFound:
 *                 value:
 *                   message: "Task not found"
 *                   statusCode: 404
 *                   code: 30001
 */
taskRouter.route("/:id").delete(tryCatch(deleteTask));

export default taskRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     TaskBase:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the task
 *           example: Complete chapter 3 exercises
 *         description:
 *           type: string
 *           description: Detailed description of the task
 *           example: Work through all examples and practice questions in chapter 3
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: The deadline for completing the task
 *           example: 2025-06-15T23:59:59.000Z
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           description: Priority level of the task
 *           default: medium
 *           example: high
 *         isCompleted:
 *           type: boolean
 *           description: Whether the task is completed
 *           default: false
 *           example: false
 *
 *     TaskCreateRequest:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the task
 *           example: Read Chapter 1
 *         description:
 *           type: string
 *           description: Detailed description of the task
 *           example: Focus on the introduction to APIs
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: The deadline for completing the task
 *           example: 2025-07-22T10:00:00.000Z
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           description: Priority level of the task
 *           example: high
 *         goal:
 *           type: string
 *           description: Optional MongoDB ObjectId of a goal to link this task to
 *           example: 6087e35b3f9d3a001f37d123
 *       example:
 *         title: Read Chapter 1
 *         description: Focus on the introduction to APIs
 *         dueDate: 2025-07-22T10:00:00.000Z
 *         priority: high
 *         goal: 6087e35b3f9d3a001f37d123
 *
 *     TaskCreateResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *           example: Task created and linked to goal
 *         task:
 *           $ref: '#/components/schemas/Task'
 *
 *     TaskUpdateRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Updated title of the task
 *           example: Read Chapters 1 & 2
 *         description:
 *           type: string
 *           nullable: true
 *           description: Updated description (null to clear)
 *           example: Focus on the core concepts and API examples
 *         dueDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Updated deadline (null to clear)
 *           example: 2025-07-25T10:00:00.000Z
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           description: Updated priority level
 *           example: medium
 *         isCompleted:
 *           type: boolean
 *           description: Mark task as completed or not completed
 *           example: true
 *         goal:
 *           type: string
 *           nullable: true
 *           description: ID of a goal to link or re-link the task to (null to make it standalone)
 *           example: 6087e35b3f9d3a001f37d124
 *       example:
 *         title: Read Chapters 1 & 2
 *         priority: medium
 *         isCompleted: true
 *
 *     TaskUpdateResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *           example: Task updated
 *         task:
 *           $ref: '#/components/schemas/Task'
 *
 *     Task:
 *       allOf:
 *         - $ref: '#/components/schemas/TaskBase'
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: MongoDB ObjectId
 *               example: 6087e45b3f9d3a001f37d124
 *             user:
 *               type: string
 *               description: MongoDB ObjectId of the user who owns this task
 *               example: 6087e0a93f9d3a001f37d120
 *             goal:
 *               type: string
 *               nullable: true
 *               description: MongoDB ObjectId of the associated goal (if any)
 *               example: 6087e35b3f9d3a001f37d123
 *             createdAt:
 *               type: string
 *               format: date-time
 *               description: Timestamp when the task was created
 *               example: 2023-10-15T14:35:00.000Z
 *             updatedAt:
 *               type: string
 *               format: date-time
 *               description: Timestamp when the task was last updated
 *               example: 2023-10-20T09:20:00.000Z
 *       example:
 *         _id: 6087e45b3f9d3a001f37d124
 *         title: Complete chapter 3 exercises
 *         description: Work through all examples and practice questions in chapter 3
 *         dueDate: 2025-06-15T23:59:59.000Z
 *         priority: high
 *         isCompleted: false
 *         user: 6087e0a93f9d3a001f37d120
 *         goal: 6087e35b3f9d3a001f37d123
 *         createdAt: 2023-10-15T14:35:00.000Z
 *         updatedAt: 2023-10-20T09:20:00.000Z
 */
