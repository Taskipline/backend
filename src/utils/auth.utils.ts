import { Response } from "express";
import { validateEnv } from "../config/env.config";

const { ACCESS_TOKEN_LIFETIME, NODE_ENV } = validateEnv();

// naive converter: "15m" | "1h" | "7d" -> ms
const durationToMs = (v: string): number => {
  const m = /^(\d+)([smhd])$/.exec(v.trim());
  if (!m) return 0;
  const n = Number(m[1]);
  const unit = m[2];
  const mul =
    unit === "s"
      ? 1_000
      : unit === "m"
        ? 60_000
        : unit === "h"
          ? 3_600_000
          : 86_400_000;
  return n * mul;
};

export const setAccessTokenCookie = (res: Response, accessToken: string) => {
  const maxAge = durationToMs(ACCESS_TOKEN_LIFETIME);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
    ...(maxAge ? { maxAge } : {}),
  });
};

/**
 * Clears the authentication cookies (accessToken, refreshToken) from the response.
 * @param res The Express response object.
 */
export const clearAuthCookies = (res: Response) => {
  res.cookie("accessToken", "", {
    httpOnly: true,
    expires: new Date(0), // Set expiry to a past date
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "strict",
  });
  res.cookie("refreshToken", "", {
    httpOnly: true,
    expires: new Date(0), // Set expiry to a past date
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};
