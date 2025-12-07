import express from "express";
import { getAllStudents, getStudentById, getStudentPerformance } from "../controllers/student.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all students (teachers can access)
router.get("/", getAllStudents);

// Get student performance (must come before /:id to avoid route conflict)
router.get("/:id/performance", getStudentPerformance);

// Get student by ID (must come last)
router.get("/:id", getStudentById);

export default router;

