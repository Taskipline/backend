import express from "express";
import waitlistRoutes from "../routes/waitlist.route";
import authRoutes from "../routes/auth.route";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message:
      "Welcome to taskipline api services! 'Building discipline with taskipline!'🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  });
});

router.use("/waitlist", waitlistRoutes);
router.use("/auth", authRoutes);

export default router;
