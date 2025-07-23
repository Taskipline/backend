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
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     description: Creates a new task. Can be a standalone task or linked to an existing goal.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Read Chapter 1"
 *               description:
 *                 type: string
 *                 example: "Focus on the introduction to APIs."
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-07-22T10:00:00.000Z"
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *                 example: "High"
 *               goal:
 *                 type: string
 *                 description: "Optional ID of the goal to link this task to."
 *                 example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       '201':
 *         description: Task created successfully.
 *       '400':
 *         description: Bad Request - Invalid input data or goal not found.
 *       '401':
 *         description: Unauthorized - Invalid or missing token.
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
 *     description: Retrieves a list of all tasks for the authenticated user.
 *     responses:
 *       '200':
 *         description: A list of tasks.
 *       '401':
 *         description: Unauthorized - Invalid or missing token.
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
 *     description: Retrieves a single task by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to retrieve.
 *     responses:
 *       '200':
 *         description: The requested task.
 *       '401':
 *         description: Unauthorized - Invalid or missing token.
 *       '404':
 *         description: Not Found - Task not found.
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
 *     description: Updates the properties of an existing task.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to update.
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
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *               isCompleted:
 *                 type: boolean
 *               goal:
 *                 type: string
 *                 description: "ID of a goal to link or re-link the task to. Send null to make it standalone."
 *     responses:
 *       '200':
 *         description: Task updated successfully.
 *       '401':
 *         description: Unauthorized - Invalid or missing token.
 *       '404':
 *         description: Not Found - Task not found.
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
 *     description: Deletes a task. If the task was linked to a goal, it is removed from that goal's task list.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task to delete.
 *     responses:
 *       '200':
 *         description: Task deleted successfully.
 *       '401':
 *         description: Unauthorized - Invalid or missing token.
 *       '404':
 *         description: Not Found - Task not found.
 */
taskRouter.route("/:id").delete(tryCatch(deleteTask));

export default taskRouter;
