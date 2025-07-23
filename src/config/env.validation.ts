import * as z from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.url().default("http://localhost:3000"),

  // Database
  MONGO_DB_URI: z.string(),

  // JWT & Cookies
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_LIFETIME: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_LIFETIME: z.string(),
  COOKIE_PARSER_SECRET: z.string(),

  // Nodemailer SMTP Configuration
  // SMTP_HOST: z.string(),
  // SMTP_PORT: z.coerce.number(),
  // SMTP_USER: z.string(),
  // SMTP_PASS: z.string(),
  // EMAIL_FROM: z.email(),

  // Resend API Keys
  RESEND_API_KEY_WAITLIST: z.string(),
  RESEND_API_KEY_VERIFY_ACCOUNT: z.string(),
  RESEND_API_KEY_WELCOME: z.string(),
  RESEND_API_KEY_PASSWORD_RESET_LINK: z.string(),
  RESEND_API_KEY_PASSWORD_RESET_SUCCESSFUL: z.string(),
  RESEND_API_KEY_PASSWORD_DELETE_ACCOUNT: z.string(),
});
export type EnvConfig = z.infer<typeof envSchema>;
