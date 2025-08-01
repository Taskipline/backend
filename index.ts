// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./src/custom.d.ts" />

import express, { Express } from "express";
import { Server, createServer } from "http";
import { logger } from "./src/config/logger";
import { validateEnv } from "./src/config/env.config";
import mongoose from "mongoose";
import { bootstrap } from "./src/loader/bootstrap";

const exitHandler = (server: Server | null) => {
  if (server) {
    server.close(async () => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unExpectedErrorHandler = (server: Server) => {
  return function (error: Error) {
    logger.error(error);
    exitHandler(server);
  };
};

const startServer = async () => {
  const app: Express = express();
  await bootstrap(app);

  const httpServer = createServer(app);
  const { PORT } = validateEnv();

  const server: Server = httpServer.listen(PORT, () => {
    logger.info(`server listening on port ${PORT}`);
  });

  process.on("uncaughtException", unExpectedErrorHandler(server));
  process.on("unhandledRejection", unExpectedErrorHandler(server));
  process.on("SIGTERM", () => {
    logger.info("SIGTERM received");
    if (server) {
      server.close();
    }
  });

  mongoose.connection.on("error", (err) => {
    console.log(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`);
  });
};

startServer();
