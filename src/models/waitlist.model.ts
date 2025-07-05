import { Schema, model } from "mongoose";
import { IWaitlist } from "../interfaces/waitlist.interface";

const waitlistSchema = new Schema<IWaitlist>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

export const Waitlist = model<IWaitlist>("Waitlist", waitlistSchema);
