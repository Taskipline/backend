import { Schema, model } from "mongoose";
import { ITask } from "../interfaces/task.interface";

const taskSchema = new Schema<ITask>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    goal: {
      type: Schema.Types.ObjectId,
      ref: "Goal",
      index: true, // Index for faster lookups of tasks by goal
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Task = model<ITask>("Task", taskSchema);
