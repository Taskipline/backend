import dotenv from "dotenv";
import { EnvConfig, envSchema } from "../validation/env.validation";
import { ZodError } from "zod";
dotenv.config();

export const validateEnv = () => {
  try {
    const envVars: EnvConfig = envSchema.parse(process.env);
    return {
      port: +envVars.PORT,
      env: envVars.NODE_ENV,
      MONGO_DB_URI: envVars.MONGO_DB_URI,
      jwtconfig: {
        accessSecret: envVars.JWT,
        refreshAccessSecret: envVars.JWT_REFRESH,
      },
      smtp: {
        host: envVars.SMTP_HOST,
        port: envVars.SMTP_PORT,
        service: envVars.SMTP_SERVICE,
        mail: envVars.SMTP_MAIL,
        password: envVars.SMTP_PASSWORD,
      },
    };
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("Validation failed:", error.errors);
    } else {
      console.error("Error parsing environment variables:", error);
    }
    throw error; // Re-throw to ensure calling code knows validation failed
  }
};
