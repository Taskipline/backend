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
    };
  } catch (error) {
    let message = undefined;
    if (error instanceof ZodError) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      message = error;
      console.error("Validation failed:", error);
    } else {
      // message = error;
      console.error("Error parsing environment variables:", error);
    }
  }
};
