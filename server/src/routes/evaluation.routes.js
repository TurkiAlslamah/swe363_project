import express from "express";
import {
    createEvaluation,
    getEvaluationsByStudent,
    getEvaluationsByTeacher
} from "../controllers/evaluation.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create evaluation (teachers only)
router.post("/", createEvaluation);

// Get evaluations by student
router.get("/student/:id", getEvaluationsByStudent);

// Get evaluations by teacher
router.get("/teacher", getEvaluationsByTeacher);

export default router;

