import { Request, Response } from "express";
import { Waitlist } from "../models/waitlist.model";
import { z } from "zod";
import { waitlistSchema } from "../schemas/waitlist.schema";

export const joinWaitlist = async (req: Request, res: Response) => {
  try {
    const { email } = waitlistSchema.parse(req.body);
    const existingEmail = await Waitlist.findOne({ email });
    if (existingEmail) {
      res.status(409).json({ message: "Email already on the waitlist" });
      return;
    }
    const newEntry = new Waitlist({ email });
    await newEntry.save();
    res.status(201).json({ message: "Successfully joined the waitlist" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ message: "Invalid email format", errors: error.errors });
      return;
    }
    res.status(500).json({ message: "Error joining waitlist", error });
  }
};

export const getWaitlist = async (req: Request, res: Response) => {
  try {
    const waitlist = await Waitlist.find().sort({ createdAt: -1 });
    res.status(200).json(waitlist);
  } catch (error) {
    res.status(500).json({ message: "Error fetching waitlist", error });
  }
};
