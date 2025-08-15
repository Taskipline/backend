import { z } from "zod";

export const nestedTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  dueDate: z.iso.datetime().optional(),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.iso.datetime().optional(), // Expecting ISO string from client
  priority: z.enum(["low", "medium", "high"]).optional(),
  goal: z.string().optional(), // Goal ID
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").optional(),
  description: z.string().optional().nullable(),
  dueDate: z.iso.datetime().optional().nullable(),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
  isCompleted: z.boolean().optional(),
  goal: z.string().optional().nullable(), // Allow moving task or making it standalone
});
