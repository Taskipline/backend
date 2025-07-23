import { Types } from "mongoose";

export interface IGoal extends Document {
  user: Types.ObjectId;
  title: string;
  description?: string;
  dueDate?: Date;
  status: "In Progress" | "Completed";
  tasks: Types.ObjectId[];
}

export type TaskForCompletion = {
  isCompleted: boolean;
};
