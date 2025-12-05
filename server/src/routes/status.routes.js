import express from "express";
import { getFullStats } from "../controllers/stats.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getFullStats);

export default router;