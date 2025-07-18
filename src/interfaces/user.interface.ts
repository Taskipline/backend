import { Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  refreshToken?: string;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
  emailNotifications: boolean;
  enableAIFeatures: boolean;
  comparePassword(password: string): Promise<boolean>;
}
