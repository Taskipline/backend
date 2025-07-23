import express from "express";
import waitlistRoutes from "../routes/waitlist.route";
import authRoutes from "../routes/auth.route";
import userRouter from "../routes/user.route";
import goalRouter from "../routes/goal.route";
import taskRouter from "../routes/task.route";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message:
      "Welcome to taskipline api services! 'Building discipline with taskipline!'🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  });
});

router.use("/waitlist", waitlistRoutes);
router.use("/auth", authRoutes);
router.use("/user", userRouter);
router.use("/goals", goalRouter);
router.use("/tasks", taskRouter);

export default router;
