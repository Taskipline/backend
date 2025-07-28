import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import { CustomAPIError } from "../errors/custom.error";

// Explicitly type the function as an ErrorRequestHandler
const errorHandlerMiddleware: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  // Check if the error is a known, custom error
  if (err instanceof CustomAPIError) {
    res.status(err.statusCode).json({ errors: err.serializeErrors() });
    return;
  }

  console.error("UNHANDLED ERROR:", err);

  res.status(500).json({
    errors: [
      {
        message: "An unexpected error occurred. Please try again.",
        stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
      },
    ],
  });
};

export default errorHandlerMiddleware;
