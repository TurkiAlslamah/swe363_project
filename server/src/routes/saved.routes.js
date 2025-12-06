 import express from "express";
import { 
    getSavedQuestions, 
    saveQuestion, 
    unsaveQuestion,
    checkSaved 
} from "../controllers/saved.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getSavedQuestions);
router.get("/check/:question_id", checkSaved);
router.post("/:question_id", saveQuestion);
router.delete("/:question_id", unsaveQuestion);

export default router;