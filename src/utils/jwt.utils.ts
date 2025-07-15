import jwt, { SignOptions } from "jsonwebtoken";
import { validateEnv } from "../config/env.config";

const {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_LIFETIME,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_LIFETIME,
} = validateEnv();

export interface JWTPayload {
  userId: string;
}

/**
 * Generates both an access and a refresh token for a given user.
 * @param payload The data to include in the token, typically the user's ID.
 * @returns An object containing the accessToken and refreshToken.
 */
export const generateTokens = (payload: JWTPayload) => {
  const tokenPayload = { userId: payload.userId };

  const accessToken = jwt.sign(tokenPayload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_LIFETIME as SignOptions["expiresIn"],
  });

  const refreshToken = jwt.sign(tokenPayload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_LIFETIME as SignOptions["expiresIn"],
  });

  return { accessToken, refreshToken };
};

/**
 * Verifies a JWT and returns its payload if valid.
 * @param token The JWT to verify.
 * @param secret The secret key used to sign the token.
 * @returns The decoded payload of the token, or null if verification fails.
 */
export const verifyToken = (
  token: string,
  secret: string
): JWTPayload | null => {
  try {
    return jwt.verify(token, secret) as JWTPayload;
  } catch {
    return null;
  }
};
