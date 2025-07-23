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

export const signinSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password cannot be empty"),
});

export const forgotPasswordSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Point error to the confirmPassword field
  });

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name cannot be empty").optional(),
  lastName: z.string().min(1, "Last name cannot be empty").optional(),
});

export const updatePreferencesSchema = z.object({
  emailNotifications: z.boolean().optional(),
  enableAIFeatures: z.boolean().optional(),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
  });

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required"),
});
