import express from "express";
import {
    startDailyTest,
    startCustomTest,
    submitExam,
    getExamStats,
    getExamHistory,
    getExamDetails
} from "../controllers/exam.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

// Specific routes FIRST
router.post("/daily", startDailyTest);
router.post("/custom", startCustomTest);
router.get("/stats", getExamStats);
router.get("/history", getExamHistory);

// Dynamic routes LAST
router.post("/:exam_id/submit", submitExam);
router.get("/:exam_id", getExamDetails);

export default router;