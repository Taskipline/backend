import express from "express";
import { joinWaitlist, getWaitlist } from "../controllers/waitlist.controller";

const router = express.Router();

router.post("/", joinWaitlist);
router.get("/", getWaitlist);

export default router;
