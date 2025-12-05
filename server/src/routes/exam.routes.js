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

// Start exams
router.post("/daily", startDailyTest);
router.post("/custom", startCustomTest);

// Submit exam
router.post("/:exam_id/submit", submitExam);

// Stats & History
router.get("/stats", getExamStats);
router.get("/history", getExamHistory);
router.get("/:exam_id", getExamDetails);

export default router;