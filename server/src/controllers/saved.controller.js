import SavedService from "../services/saved.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

// Get all saved questions
export const getSavedQuestions = asyncHandler(async (req, res) => {
    const user_id = new mongoose.Types.ObjectId(req.user.userId);

    const data = await SavedService.getSavedQuestions(user_id);
    res.status(200).json(new ApiResponse(200, data, "تم جلب الأسئلة المحفوظة"));
});

// Save question
export const saveQuestion = asyncHandler(async (req, res) => {
    const user_id = new mongoose.Types.ObjectId(req.user.userId);
    const { question_id } = req.params;
    const q_no = parseInt(question_id);  // Convert to number

    const saved = await SavedService.saveQuestion(user_id, q_no);
    res.status(201).json(new ApiResponse(201, saved, "تم حفظ السؤال"));
});

// Unsave question
export const unsaveQuestion = asyncHandler(async (req, res) => {
    const user_id = new mongoose.Types.ObjectId(req.user.userId);
    const { question_id } = req.params;
    const q_no = parseInt(question_id);  // Convert to number

    await SavedService.unsaveQuestion(user_id, q_no);
    res.status(200).json(new ApiResponse(200, null, "تم إلغاء حفظ السؤال"));
});

// Check if question is saved
export const checkSaved = asyncHandler(async (req, res) => {
    const user_id = new mongoose.Types.ObjectId(req.user.userId);
    const { question_id } = req.params;
    const q_no = parseInt(question_id);  // Convert to number

    const isSaved = await SavedService.isQuestionSaved(user_id, q_no);
    res.status(200).json(new ApiResponse(200, { is_saved: isSaved }, "تم التحقق"));
});