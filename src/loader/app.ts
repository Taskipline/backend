import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../config/swagger";
import api from "../api/index.api";
import {
  notFoundMiddleware,
  errorHandlerMiddleware,
} from "../middleware/index.middleware";
import { corsOptions } from "../config/corsOptions";
import { errorHandler, successHandler } from "../config/morgan";
import { validateEnv } from "../config/env.config";

config();

const { COOKIE_PARSER_SECRET } = validateEnv();

export const bootstrapExpress = (app: express.Application) => {
  app.use(successHandler);
  app.use(errorHandler);
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
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(cookieParser(COOKIE_PARSER_SECRET));
  app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/api/v1/", api);
  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);
};
