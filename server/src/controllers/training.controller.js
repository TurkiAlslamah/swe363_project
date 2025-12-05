import TrainingService from "../services/training.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

// ============ PROGRESS ============

// Get progress for specific internal_type
export const getProgress = asyncHandler(async (req, res) => {
    const user_id = new mongoose.Types.ObjectId(req.user.userId);
    const { internal_type_id } = req.params;

    const progress = await TrainingService.getProgress(user_id, parseInt(internal_type_id));
    res.status(200).json(new ApiResponse(200, progress, "تم جلب التقدم"));
});

// Get all progress for user
export const getAllProgress = asyncHandler(async (req, res) => {
    const user_id = new mongoose.Types.ObjectId(req.user.userId);

    const progress = await TrainingService.getAllProgressByUser(user_id);
    res.status(200).json(new ApiResponse(200, progress, "تم جلب جميع التقدم"));
});

// Update progress
export const updateProgress = asyncHandler(async (req, res) => {
    const user_id = new mongoose.Types.ObjectId(req.user.userId);
    const { internal_type_id } = req.params;
    const { last_question_index } = req.body;

    const progress = await TrainingService.updateProgress(
        user_id, 
        parseInt(internal_type_id), 
        last_question_index
    );
    res.status(200).json(new ApiResponse(200, progress, "تم تحديث التقدم"));
});

// Reset progress
export const resetProgress = asyncHandler(async (req, res) => {
    const user_id = new mongoose.Types.ObjectId(req.user.userId);
    const { internal_type_id } = req.params;

    const progress = await TrainingService.resetProgress(user_id, parseInt(internal_type_id));
    res.status(200).json(new ApiResponse(200, progress, "تم إعادة تعيين التقدم"));
});

// ============ ATTEMPTS ============

// Save attempt
export const saveAttempt = asyncHandler(async (req, res) => {
    const user_id = new mongoose.Types.ObjectId(req.user.userId);
    const { question_id, q_no, internal_type_id, user_answer } = req.body;

    if (!question_id || !q_no || !internal_type_id || !user_answer) {
        return res.status(400).json(new ApiResponse(400, null, "جميع الحقول مطلوبة"));
    }

    const attempt = await TrainingService.saveAttempt({
        user_id,
        question_id,
        q_no,
        internal_type_id,
        user_answer
    });

    res.status(201).json(new ApiResponse(201, attempt, "تم حفظ المحاولة"));
});

// Get all attempts for user
export const getAttempts = asyncHandler(async (req, res) => {
    const user_id = new mongoose.Types.ObjectId(req.user.userId);

    const attempts = await TrainingService.getAttemptsByUser(user_id);
    res.status(200).json(new ApiResponse(200, attempts, "تم جلب المحاولات"));
});

// Get attempts by internal_type
export const getAttemptsByType = asyncHandler(async (req, res) => {
    const user_id = new mongoose.Types.ObjectId(req.user.userId);
    const { internal_type_id } = req.params;

    const attempts = await TrainingService.getAttemptsByUserAndType(
        user_id, 
        parseInt(internal_type_id)
    );
    res.status(200).json(new ApiResponse(200, attempts, "تم جلب المحاولات"));
});

// ============ STATS ============

// Get stats by internal_type
export const getStats = asyncHandler(async (req, res) => {
    const user_id = new mongoose.Types.ObjectId(req.user.userId);

    const stats = await TrainingService.getUserStats(user_id);
    res.status(200).json(new ApiResponse(200, stats, "تم جلب الإحصائيات"));
});

// Get overall stats
export const getOverallStats = asyncHandler(async (req, res) => {
    const user_id = new mongoose.Types.ObjectId(req.user.userId);

    const stats = await TrainingService.getOverallStats(user_id);
    res.status(200).json(new ApiResponse(200, stats, "تم جلب الإحصائيات العامة"));
});

// Get wrong answers
export const getWrongAnswers = asyncHandler(async (req, res) => {
    const user_id = new mongoose.Types.ObjectId(req.user.userId);
    const { internal_type_id } = req.query;

    const data = await TrainingService.getWrongAnswers(
        user_id, 
        internal_type_id || null
    );
    res.status(200).json(new ApiResponse(200, data, "تم جلب الإجابات الخاطئة"));
});

// ============ TRAINING OVERVIEW ============

// Get single question by index
export const getQuestionByIndex = asyncHandler(async (req, res) => {
    const user_id = new mongoose.Types.ObjectId(req.user.userId);
    const { internal_type_id } = req.params;
    const index = parseInt(req.query.index) || 0;

    const data = await TrainingService.getQuestionByIndex(
        user_id,
        parseInt(internal_type_id),
        index
    );
    res.status(200).json(new ApiResponse(200, data, "تم جلب السؤال"));
});

// Get training overview (for training page)
export const getTrainingOverview = asyncHandler(async (req, res) => {
    const user_id = new mongoose.Types.ObjectId(req.user.userId);
    const { type_id } = req.query;

    const overview = await TrainingService.getTrainingOverview(user_id, type_id);
    res.status(200).json(new ApiResponse(200, overview, "تم جلب نظرة عامة على التدريب"));
});

// Get training by internal type (with all questions)
export const getTrainingByInternalType = asyncHandler(async (req, res) => {
    const user_id = new mongoose.Types.ObjectId(req.user.userId);
    const { internal_type_id } = req.params;

    const training = await TrainingService.getTrainingByInternalType(
        user_id, 
        parseInt(internal_type_id)
    );
    res.status(200).json(new ApiResponse(200, training, "تم جلب بيانات التدريب"));
});