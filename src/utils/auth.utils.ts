import { Response } from "express";

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
