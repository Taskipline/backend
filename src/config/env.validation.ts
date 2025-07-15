import * as z from "zod";

export const envSchema = z.object({
  PORT: z.string({ error: "Port number is required" }),
  NODE_ENV: z.enum(["development", "production", "test"]),
  MONGO_DB_URI: z.string({ error: "Db url is required" }),
  RESEND_API_KEY_WAITLIST: z.string({
    error: "Waitlist Resend API key is required",
  }),
  RESEND_API_KEY_VERIFY_ACCOUNT: z.string({
    error: "Verify Account Resend API key is required",
  }),
  RESEND_API_KEY_WELCOME: z.string({
    error: "Welcome Resend API key is required",
  }),
  CLIENT_URL: z.url().default("http://localhost:3000"),
});
export type EnvConfig = z.infer<typeof envSchema>;
