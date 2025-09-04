import { Request, Response } from "express";
import mongoose from "mongoose";
import { Task } from "../models/task.model";
import { Goal } from "../models/goal.model";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema";
import { ErrorCode } from "../errors/custom.error";
import BadRequestError from "../errors/badRequest.error";
import NotFoundError from "../errors/notFound.error";

export const createTask = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { goal: goalId, ...taskData } = createTaskSchema.parse(req.body);

  if (!goalId) {
    // Create a standalone task
    const task = await Task.create({ ...taskData, user: userId });
    res.status(201).json({ message: "Task created", task });
    return;
  }

  // Create a task linked to a goal within a transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const goal = await Goal.findOne({ _id: goalId, user: userId }).session(
      session
    );
    if (!goal) {
      throw new BadRequestError(
        "Goal not found or you do not have permission to access it",
        ErrorCode.GOAL_NOT_FOUND
      );
    }

    const task = new Task({ ...taskData, user: userId, goal: goalId });
    const savedTask = await task.save({ session });

    goal.tasks.push(savedTask._id as mongoose.Types.ObjectId);
    await goal.save({ session });

    await session.commitTransaction();
    res
      .status(201)
      .json({ message: "Task created and linked to goal", task: savedTask });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  // Basic filtering can be added here later (e.g., by goal, date)
  const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });
  res.status(200).json({ tasks });
};

export const getTaskById = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { id: taskId } = req.params;

  const task = await Task.findOne({ _id: taskId, user: userId });
  if (!task) {
    throw new NotFoundError("Task not found", ErrorCode.TASK_NOT_FOUND);
  }
  res.status(200).json({ task });
};

export const updateTask = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { id: taskId } = req.params;
  const updateData = updateTaskSchema.parse(req.body);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const currentTask = await Task.findOne({
      _id: taskId,
      user: userId,
    }).session(session);
    if (!currentTask) {
      throw new NotFoundError("Task not found", ErrorCode.TASK_NOT_FOUND);
    }

    const oldGoalId = currentTask.goal;

    const isGoalFieldModified = "goal" in updateData;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      updateData,
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    if (isGoalFieldModified) {
      const newGoalId = updateData.goal;

      if (oldGoalId) {
        if (!newGoalId || oldGoalId.toString() !== newGoalId.toString()) {
          await Goal.updateOne(
            { _id: oldGoalId, user: userId },
            { $pull: { tasks: taskId } },
            { session }
          );
        }
      }

      if (newGoalId) {
        if (!oldGoalId || oldGoalId.toString() !== newGoalId.toString()) {
          const newGoal = await Goal.findOne({
            _id: newGoalId,
            user: userId,
          }).session(session);
          if (!newGoal) {
            throw new BadRequestError(
              "Goal not found or you do not have permission to access it",
              ErrorCode.GOAL_NOT_FOUND
            );
          }

          await Goal.updateOne(
            { _id: newGoalId },
            { $addToSet: { tasks: taskId } },
            { session }
          );
        }
      }
    }

    await session.commitTransaction();
    res.status(200).json({ message: "Task updated", task: updatedTask });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { id: taskId } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const task = await Task.findOne({ _id: taskId, user: userId }).session(
      session
    );
    if (!task) {
      throw new NotFoundError("Task not found", ErrorCode.TASK_NOT_FOUND);
    }

    // If task is linked to a goal, remove the reference
    if (task.goal) {
      await Goal.updateOne(
        { _id: task.goal },
        { $pull: { tasks: task._id } }
      ).session(session);
    }

    await task.deleteOne({ session });

    await session.commitTransaction();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
