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
  RESEND_API_KEY_PASSWORD_RESET_LINK: z.string({
    error: "Password Reset Link Resend API key is required",
  }),
  RESEND_API_KEY_PASSWORD_RESET_SUCCESSFUL: z.string({
    error: "Password Reset Successful Resend API key is required",
  }),
  CLIENT_URL: z.url().default("http://localhost:3000"),
  ACCESS_TOKEN_SECRET: z.string({
    error: "Access token secret is required",
  }),
  ACCESS_TOKEN_LIFETIME: z.string().default("15m"),
  REFRESH_TOKEN_SECRET: z.string({
    error: "Refresh token secret is required",
  }),
  REFRESH_TOKEN_LIFETIME: z.string().default("7d"),
  COOKIE_PARSER_SECRET: z.string({
    error: "Cookie parser secret is required",
  }),
});
export type EnvConfig = z.infer<typeof envSchema>;
