import { Document, Types } from "mongoose";

export interface ITask extends Document {
  user: Types.ObjectId;
  goal?: Types.ObjectId;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: "Low" | "Medium" | "High";
  isCompleted: boolean;
}
