import dotenv from "dotenv";
import { envSchema } from "./env.validation";
import * as z from "zod";
dotenv.config();

export const validateEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(
        "Environment variable validation failed:",
        z.treeifyError(error)
      );
      process.exit(1);
    }
    throw error;
  }
};
