import { Request, Response } from "express";
import mongoose from "mongoose";
import { validateEnv } from "../config/env.config";

interface HealthStatus {
  status: "healthy" | "unhealthy";
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  database: {
    status: "connected" | "disconnected" | "error";
    responseTime?: number;
  };
  memory: {
    used: string;
    total: string;
    usage: string;
  };
}

export const healthCheck = async (
  req: Request,
  res: Response
): Promise<void> => {
  const startTime = Date.now();

  try {
    const { env } = validateEnv();

    // Check database connection
    let dbStatus: "connected" | "disconnected" | "error" = "disconnected";
    let dbResponseTime: number | undefined;

    try {
      if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
        const dbStart = Date.now();
        await mongoose.connection.db.admin().ping();
        dbResponseTime = Date.now() - dbStart;
        dbStatus = "connected";
      }
    } catch (error) {
      dbStatus = "error";
    }

    // Get memory usage
    const memoryUsage = process.memoryUsage();
    const formatBytes = (bytes: number): string => {
      return (bytes / 1024 / 1024).toFixed(2) + " MB";
    };

    const healthStatus: HealthStatus = {
      status: dbStatus === "connected" ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env,
      version: process.env.npm_package_version || "1.0.0",
      database: {
        status: dbStatus,
        ...(dbResponseTime && { responseTime: dbResponseTime }),
      },
      memory: {
        used: formatBytes(memoryUsage.heapUsed),
        total: formatBytes(memoryUsage.heapTotal),
        usage:
          ((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100).toFixed(2) +
          "%",
      },
    };

    const statusCode = healthStatus.status === "healthy" ? 200 : 503;
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    const errorStatus: HealthStatus = {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: "unknown",
      version: "1.0.0",
      database: {
        status: "error",
      },
      memory: {
        used: "0 MB",
        total: "0 MB",
        usage: "0%",
      },
    };

    res.status(503).json(errorStatus);
  }
};

export const liveCheck = (req: Request, res: Response): void => {
  res.status(200).json({
    status: "alive",
    timestamp: new Date().toISOString(),
  });
};

export const readyCheck = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Check if database is ready
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      await mongoose.connection.db.admin().ping();
      res.status(200).json({
        status: "ready",
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(503).json({
        status: "not ready",
        reason: "Database not connected",
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    res.status(503).json({
      status: "not ready",
      reason: "Database error",
      timestamp: new Date().toISOString(),
    });
  }
};
