import express from "express";
import {
    // Question Types
    getAllQuestionTypes,
    createQuestionType,
    // Internal Types
    getAllInternalTypes,
    getInternalTypesByTypeId,
    createInternalType,
    // Passages
    getAllPassages,
    getPassageById,
    createPassage,
    updatePassage,
    deletePassage,
    // Questions
    getAllQuestions,
    getQuestionById,
    getQuestionsByPassageId,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getRandomQuestions
    , bulkCreateQuestions,
    deleteAllQuestions
} from "../controllers/question.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { getDashboard } from "../controllers/question.controller.js";


const router = express.Router();

// ============ DASHBOARD ============
router.get("/dashboard", protect, getDashboard);

// ============ QUESTION TYPES ============
router.get("/types", getAllQuestionTypes);
router.post("/types", protect, createQuestionType);

// ============ INTERNAL TYPES ============
router.get("/internal-types", getAllInternalTypes);
router.get("/internal-types/:typeId", getInternalTypesByTypeId);
router.post("/internal-types", protect, createInternalType);

// ============ PASSAGES ============
router.get("/passages", getAllPassages);
router.get("/passages/:id", getPassageById);
router.post("/passages", protect, createPassage);
router.put("/passages/:id", protect, updatePassage);
router.delete("/passages/:id", protect, deletePassage);

// ============ QUESTIONS ============
router.get("/", getAllQuestions);
router.get("/random", getRandomQuestions);
router.post("/bulk-insert", bulkCreateQuestions);
router.delete("/all", deleteAllQuestions);
router.get("/passage/:passageId", getQuestionsByPassageId);
router.post("/", protect, createQuestion);

// ============ DYNAMIC :id ROUTES - MUST BE LAST! ============
router.get("/:id", getQuestionById);
router.put("/:id", protect, updateQuestion);
router.delete("/:id", protect, deleteQuestion);

export default router;
