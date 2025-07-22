import { Request, Response } from "express";
import mongoose from "mongoose";
import { Goal } from "../models/goal.model";
import { Task } from "../models/task.model";
import { createGoalSchema, updateGoalSchema } from "../schemas/goal.schema";
import { ErrorCode } from "../errors/custom.error";
import NotFoundError from "../errors/notFound.error";
import { TaskForCompletion } from "../interfaces/goal.interface";

// Reusable function to calculate completion percentage
const calculateCompletion = (tasks: TaskForCompletion[]): number => {
  if (!tasks || tasks.length === 0) return 0;
  const completedTasks = tasks.filter((task) => task.isCompleted).length;
  return Math.round((completedTasks / tasks.length) * 100);
};

export const createGoal = async (req: Request, res: Response) => {
  const {
    title,
    description,
    dueDate,
    tasks: nestedTasks,
  } = createGoalSchema.parse(req.body);
  const userId = req.user!.userId;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newGoal = new Goal({
      title,
      description,
      dueDate,
      user: userId,
      tasks: [],
    });
    const savedGoal = await newGoal.save({ session });
    const createdTaskIds: mongoose.Types.ObjectId[] = [];

    if (nestedTasks && nestedTasks.length > 0) {
      const tasksToCreate = nestedTasks.map((taskData) => ({
        ...taskData,
        user: userId,
        goal: savedGoal._id,
      }));
      const createdTasks = await Task.insertMany(tasksToCreate, { session });
      createdTasks.forEach((task) =>
        createdTaskIds.push(task._id as mongoose.Types.ObjectId)
      );
      savedGoal.tasks = createdTaskIds;
      await savedGoal.save({ session });
    }

    await session.commitTransaction();
    res.status(201).json({
      message: "Goal created successfully",
      goal: savedGoal,
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getAllGoals = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const goals = await Goal.find({ user: userId })
    .populate("tasks", "isCompleted") // Only populate the field we need for calculation
    .sort({ createdAt: -1 });

  const goalsWithCompletion = goals.map((goal) => {
    const goalObject = goal.toObject();
    return {
      ...goalObject,
      completionPercentage: calculateCompletion(
        goal.tasks as unknown as TaskForCompletion[]
      ),
    };
  });

  res.status(200).json({ goals: goalsWithCompletion });
};

export const getGoalById = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { id: goalId } = req.params;

  const goal = await Goal.findOne({ _id: goalId, user: userId }).populate(
    "tasks"
  );

  if (!goal) {
    throw new NotFoundError("Goal not found", ErrorCode.GOAL_NOT_FOUND);
  }

  const goalWithCompletion = {
    ...goal.toObject(),
    completionPercentage: calculateCompletion(
      goal.tasks as unknown as TaskForCompletion[]
    ),
  };

  res.status(200).json({ goal: goalWithCompletion });
};

export const updateGoal = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { id: goalId } = req.params;
  const body = updateGoalSchema.parse(req.body);

  const updatedGoal = await Goal.findOneAndUpdate(
    { _id: goalId, user: userId },
    body,
    { new: true, runValidators: true }
  );

  if (!updatedGoal) {
    throw new NotFoundError("Goal not found", ErrorCode.GOAL_NOT_FOUND);
  }

  res.status(200).json({ message: "Goal updated", goal: updatedGoal });
};

export const deleteGoal = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { id: goalId } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const goal = await Goal.findOne({ _id: goalId, user: userId }).session(
      session
    );
    if (!goal) {
      throw new NotFoundError("Goal not found", ErrorCode.GOAL_NOT_FOUND);
    }

    // Delete all tasks associated with the goal
    await Task.deleteMany({ _id: { $in: goal.tasks } }).session(session);

    // Delete the goal itself
    await goal.deleteOne({ session });

    await session.commitTransaction();
    res.status(200).json({ message: "Goal and associated tasks deleted" });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
