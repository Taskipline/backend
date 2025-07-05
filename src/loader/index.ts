import { bootstrapExpress } from "./app";
import { logger } from "../config/logger";
import { validateEnv } from "../config/env.config";
import { connectToDB } from "../config/mongoose";
import { EventEmitterInstance } from "../config/event-emitter";
import {
  signUpSubscriber,
  forgetPasswordSubscriber,
} from "../subscriber/auth.subscriber";
import { Application, Express } from "express";

export const bootstrap = async (app: Express) => {
  validateEnv();
  await connectToDB();
  bootstrapExpress(app);
  logger.info("Express app initiated.");

  EventEmitterInstance.on("signup", signUpSubscriber);
  EventEmitterInstance.on("forgot", forgetPasswordSubscriber);
};
