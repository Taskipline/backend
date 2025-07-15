import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors/index.error";
import { verifyToken } from "../utils/jwt.utils";
import { validateEnv } from "../config/env.config";
import { ErrorCode } from "../errors/custom.error";

const authenticatedUserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ACCESS_TOKEN_SECRET } = validateEnv();
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError(
      "Authentication invalid: No token provided",
      ErrorCode.UNAUTHENTICATED
    );
  }

  const token = authHeader.split(" ")[1];

  const payload = verifyToken(token, ACCESS_TOKEN_SECRET);

  if (!payload) {
    throw new UnauthorizedError(
      "Authentication invalid: Token is invalid or expired",
      ErrorCode.UNAUTHENTICATED
    );
  }

  // Attach the user payload to the request object for use in subsequent controllers
  req.user = { userId: payload.userId };
  next();
};

export default authenticatedUserMiddleware;
