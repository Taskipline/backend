import { z } from "zod";

export const envSchema = z.object({
  PORT: z.string({ required_error: "Port number is required" }),
  NODE_ENV: z.enum(["development", "production", "test"]),
  MONGO_DB_URI: z.string({ required_error: "Db url is required" }),
  RESEND_API_KEY: z.string({ required_error: "Resend API key is required" }),
});
export type EnvConfig = z.infer<typeof envSchema>;
