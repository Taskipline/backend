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

  if (!authHeader) {
    throw new UnauthorizedError(
      "Authentication invalid: No token provided",
      ErrorCode.UNAUTHENTICATED
    );
  }

  const [scheme, token] = authHeader.split(" ");

  const payload = verifyToken(token, ACCESS_TOKEN_SECRET);

  switch (scheme) {
    case "Bearer":
      if (!payload) {
        throw new UnauthorizedError(
          "Authentication invalid: Bearer token is invalid or expired",
          ErrorCode.EXPIRED_BEARER_TOKEN
        );
      }
      break;
    case "KALIE":
      if (!payload) {
        throw new UnauthorizedError(
          "Authentication invalid: Kalie token is invalid or expired",
          ErrorCode.EXPIRED_KALIE_TOKEN
        );
      }
      break;
    default:
      throw new UnauthorizedError(
        "Authentication invalid: Unknown authentication header scheme",
        ErrorCode.UNKNOWN_HEADER_SCHEME
      );
  }

  // Attach the user payload to the request object for use in subsequent controllers
  req.user = { userId: payload.userId };
  next();
};

export default authenticatedUserMiddleware;
