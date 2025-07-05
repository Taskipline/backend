import express from "express";
import waitlistRoutes from "../routes/waitlist.route";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message:
      "Welcome to taskipline api services! 'Building discipline with taskipline!'🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  });
});

router.use("/waitlist", waitlistRoutes);

export default router;
