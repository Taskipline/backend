import { config } from "dotenv";
import express, { Express } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import api from "../api/index.api";
import { notFoundMiddleware } from "../middleware/index.middleware";
import errorHandlerMiddleware from "../middleware/errorHandler.middleware";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { corsOptions } from "../config/corsOptions";
import { errorHandler, successHandler } from "../config/morgan";
import { setupSwagger } from "../config/swagger";
import { generalLimiter } from "../middleware/rateLimiter.middleware";

config();

export const bootstrapExpress = (app: Express) => {
  // Logging middleware
  app.use(successHandler);
  app.use(errorHandler);

  // Security middleware
  app.use(ExpressMongoSanitize());
  app.use(morgan("dev"));
  app.use(helmet());
  app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
  app.use(helmet.xssFilter());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'trusted-cdn.com'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    })
  );

  // Rate limiting
  app.use(generalLimiter);

  // CORS and parsing middleware
  app.use(cors(corsOptions));
  app.use(express.json({ limit: "30mb" }));
  app.use(express.urlencoded({ extended: true, limit: "30mb" }));
  app.use(cookieParser());

  // Setup Swagger documentation
  setupSwagger(app);

  // API routes
  app.use("/api/", api);

  // Error handling middleware (must be last)
  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);
};
