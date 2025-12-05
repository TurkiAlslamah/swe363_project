import express from "express";
import {
    // Progress
    getProgress,
    getAllProgress,
    updateProgress,
    resetProgress,
    // Attempts
    saveAttempt,
    getAttempts,
    getAttemptsByType,
    // Stats
    getStats,
    getOverallStats,
    getWrongAnswers,
    // Training Overview
    getTrainingOverview,
    getTrainingByInternalType,
    getQuestionByIndex
} from "../controllers/training.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// ============ TRAINING OVERVIEW (Main endpoints for training page) ============
router.get("/overview", getTrainingOverview);
router.get("/question/:internal_type_id", getQuestionByIndex);

// ============ PROGRESS ============
router.get("/progress", getAllProgress);
router.get("/progress/:internal_type_id", getProgress);
router.put("/progress/:internal_type_id", updateProgress);
router.post("/progress/:internal_type_id/reset", resetProgress);

// ============ ATTEMPTS ============
router.post("/attempts", saveAttempt);
router.get("/attempts", getAttempts);
router.get("/attempts/:internal_type_id", getAttemptsByType);

// ============ STATS ============
router.get("/stats", getStats);
router.get("/stats/overall", getOverallStats);
router.get("/stats/wrong-answers", getWrongAnswers);

export default router;