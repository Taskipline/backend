import { Request, Response } from "express";
import crypto from "crypto";
import { User } from "../models/user.model";
import { resendVerificationSchema, signupSchema } from "../schemas/user.schema";
import {
  sendAccountVerificationEmail,
  sendWelcomeEmail,
} from "../services/email.service";
import { BadRequestError, ConflictError } from "../errors/index.error";
import {
  ACCOUNT_VERIFICATION_DIGEST_ENCODING,
  ACCOUNT_VERIFICATION_HASH_ALGORITHM,
  ACCOUNT_VERIFICATION_TOKEN_BYTES,
  ACCOUNT_VERIFICATION_TOKEN_ENCODING,
  ACCOUNT_VERIFICATION_TOKEN_EXPIRATION_MINUTES,
} from "../config/constants.config";
import { ErrorCode } from "../errors/custom.error";

export const signup = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = signupSchema.parse(req.body);

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ConflictError(
      "An account with this email already exists.",
      ErrorCode.EMAIL_ALREADY_EXISTS
    );
  }

  // Create user
  const user = new User({
    firstName,
    lastName,
    email,
    password,
  });

  // Generate verification token
  const verificationToken = crypto
    .randomBytes(ACCOUNT_VERIFICATION_TOKEN_BYTES)
    .toString(ACCOUNT_VERIFICATION_TOKEN_ENCODING);

  // Hash token and set expiry date
  user.verificationToken = crypto
    .createHash(ACCOUNT_VERIFICATION_HASH_ALGORITHM)
    .update(verificationToken)
    .digest(ACCOUNT_VERIFICATION_DIGEST_ENCODING);

  user.verificationTokenExpires = new Date(
    Date.now() + ACCOUNT_VERIFICATION_TOKEN_EXPIRATION_MINUTES * 60 * 1000
  );

  await user.save();

  // Send verification email
  // Note: We send the UNHASHED token in the email link
  await sendAccountVerificationEmail(user.email, verificationToken);

  res.status(201).json({
    message:
      "Signup successful. Please check your email to verify your account.",
  });
};

export const verifyAccount = async (req: Request, res: Response) => {
  const { token } = req.params;

  // Hash the incoming token to match the one in the DB
  const hashedToken = crypto
    .createHash(ACCOUNT_VERIFICATION_HASH_ALGORITHM)
    .update(token)
    .digest(ACCOUNT_VERIFICATION_DIGEST_ENCODING);

  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new BadRequestError(
      "Invalid or expired verification token.",
      ErrorCode.INVALID_VERIFICATION_TOKEN
    );
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  // Send final welcome email
  await sendWelcomeEmail(user.email, user.firstName);

  res.status(200).json({ message: "Account verified successfully." });
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
  const { email } = resendVerificationSchema.parse(req.body);

  const user = await User.findOne({ email });

  // Security: Always return a success message to prevent email enumeration.
  // Only proceed if the user exists and is not yet verified.
  if (user && !user.isVerified) {
    // Generate new verification token
    const verificationToken = crypto
      .randomBytes(ACCOUNT_VERIFICATION_TOKEN_BYTES)
      .toString(ACCOUNT_VERIFICATION_TOKEN_ENCODING);

    // Hash token and set new expiry date
    user.verificationToken = crypto
      .createHash(ACCOUNT_VERIFICATION_HASH_ALGORITHM)
      .update(verificationToken)
      .digest(ACCOUNT_VERIFICATION_DIGEST_ENCODING);

    user.verificationTokenExpires = new Date(
      Date.now() + ACCOUNT_VERIFICATION_TOKEN_EXPIRATION_MINUTES * 60 * 1000
    );

    await user.save();

    // Send the new verification email
    await sendAccountVerificationEmail(user.email, verificationToken);
  }

  res.status(200).json({
    message:
      "If an account with this email exists and is not verified, a new verification link has been sent.",
  });
};
