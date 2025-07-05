import express from "express";
import role from "./role.api";
import auth from "./auth.api";
import health from "./health.api";

const router = express.Router();

router.use("/role", role);
router.use("/auth", auth);
router.use("/health", health);

/**
 * @swagger
 * /api/:
 *   get:
 *     summary: Welcome message
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome to taskipline api services! 'Building discipline with taskipline!'🦄🌈✨👋🌎🌍🌏✨🌈🦄
 */
router.get("/", (req, res) => {
  res.json({
    message:
      "Welcome to taskipline api services! 'Building discipline with taskipline!'🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  });
});

export default router;
