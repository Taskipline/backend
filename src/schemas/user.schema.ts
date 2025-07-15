import * as z from "zod";

export const signupSchema = z.object({
  firstName: z
    .string({ error: "First name is required" })
    .min(1, "First name cannot be empty"),
  lastName: z
    .string({ error: "Last name is required" })
    .min(1, "Last name cannot be empty"),
  email: z.email("Invalid email address"),
  password: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters long"),
});

export const resendVerificationSchema = z.object({
  email: z.email("Invalid email address"),
});
