import express from "express";
import {
    getAllPassages,
    getPassageById,
    createPassage,
    updatePassage,
    deletePassage
} from "../controllers/passage.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getAllPassages);
router.get("/:id", getPassageById);
router.post("/", protect, createPassage);
router.put("/:id", protect, updatePassage);
router.delete("/:id", protect, deletePassage);

export default router;

