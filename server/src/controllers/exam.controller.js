import ExamService from "../services/exam.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

// Start daily test
export const startDailyTest = asyncHandler(async (req, res) => {
    const user_id = new mongoose.Types.ObjectId(req.user.userId);
    const { time_per_question } = req.body;

    const exam = await ExamService.startDailyTest(user_id, time_per_question || 30);
    res.status(201).json(new ApiResponse(201, exam, "تم بدء الاختبار اليومي"));
});

// Start custom test
export const startCustomTest = asyncHandler(async (req, res) => {
    const user_id = new mongoose.Types.ObjectId(req.user.userId);
    const { selections, time_per_question } = req.body;

    // selections = [{ internal_type_id: 6, count: 5 }, ...]
    if (!selections || !Array.isArray(selections)) {
        return res.status(400).json(new ApiResponse(400, null, "يرجى اختيار الأسئلة"));
    }

    const exam = await ExamService.startCustomTest(user_id, selections, time_per_question || 30);
    res.status(201).json(new ApiResponse(201, exam, "تم بدء الاختبار المخصص"));
});

// Submit exam
export const submitExam = asyncHandler(async (req, res) => {
    const user_id = new mongoose.Types.ObjectId(req.user.userId);
    const { exam_id } = req.params;
    const { answers, time_spent } = req.body;

    // answers = [{ question_id: "...", user_answer: "a" }, ...]
    const result = await ExamService.submitExam(user_id, exam_id, answers, time_spent || 0);
    res.status(200).json(new ApiResponse(200, result, "تم إنهاء الاختبار"));
});

// Get exam stats
export const getExamStats = asyncHandler(async (req, res) => {
    const user_id = new mongoose.Types.ObjectId(req.user.userId);

    const stats = await ExamService.getExamStats(user_id);
    res.status(200).json(new ApiResponse(200, stats, "تم جلب إحصائيات الاختبارات"));
});

// Get exam history
export const getExamHistory = asyncHandler(async (req, res) => {
    const user_id = new mongoose.Types.ObjectId(req.user.userId);

    const history = await ExamService.getExamHistory(user_id);
    res.status(200).json(new ApiResponse(200, history, "تم جلب سجل الاختبارات"));
});

// Get exam details
export const getExamDetails = asyncHandler(async (req, res) => {
    const user_id = new mongoose.Types.ObjectId(req.user.userId);
    const { exam_id } = req.params;

    const exam = await ExamService.getExamDetails(user_id, exam_id);
    res.status(200).json(new ApiResponse(200, exam, "تم جلب تفاصيل الاختبار"));
});