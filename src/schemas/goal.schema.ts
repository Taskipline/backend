import { z } from "zod";
import { nestedTaskSchema } from "./task.schema";

export const createGoalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.iso.datetime().optional(),
  tasks: z.array(nestedTaskSchema).optional(),
});

export const updateGoalSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").optional(),
  description: z.string().optional().nullable(), // Allow setting to null to clear it
  dueDate: z.iso.datetime().optional().nullable(),
  status: z.enum(["In Progress", "Completed"]).optional(),
});
