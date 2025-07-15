import dotenv from "dotenv";
import { EnvConfig, envSchema } from "./env.validation";
import { ZodError } from "zod";
dotenv.config();

export const validateEnv = () => {
  try {
    const envVars: EnvConfig = envSchema.parse(process.env);
    return {
      port: +envVars.PORT,
      env: envVars.NODE_ENV,
      MONGO_DB_URI: envVars.MONGO_DB_URI,
      RESEND_API_KEY_WAITLIST: envVars.RESEND_API_KEY_WAITLIST,
      RESEND_API_KEY_VERIFY_ACCOUNT: envVars.RESEND_API_KEY_VERIFY_ACCOUNT,
      RESEND_API_KEY_WELCOME: envVars.RESEND_API_KEY_WELCOME,
      CLIENT_URL: envVars.CLIENT_URL,
      ACCESS_TOKEN_SECRET: envVars.ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_LIFETIME: envVars.ACCESS_TOKEN_LIFETIME,
      REFRESH_TOKEN_SECRET: envVars.REFRESH_TOKEN_SECRET,
      REFRESH_TOKEN_LIFETIME: envVars.REFRESH_TOKEN_LIFETIME,
      COOKIE_PARSER_SECRET: envVars.COOKIE_PARSER_SECRET,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("🔥 Invalid environment variables:", error.format());
    } else {
      console.error("🔥 Error parsing environment variables:", error);
    }
    // If validation fails, the application cannot run correctly.
    // Exit the process to prevent running with an invalid configuration.
    process.exit(1);
  }
};
