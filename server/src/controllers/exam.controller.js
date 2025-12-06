import ExamService from "../services/exam.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";

// Start daily test
export const startDailyTest = async (req, res) => {
    try {
        const user_id = new mongoose.Types.ObjectId(req.user.userId);
        const exam = await ExamService.startDailyTest(user_id);
        res.status(201).json(new ApiResponse(201, exam, "تم بدء الاختبار اليومي"));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

// Start custom test
export const startCustomTest = async (req, res) => {
    try {
        const user_id = new mongoose.Types.ObjectId(req.user.userId);
        const { selections } = req.body;

        if (!selections || !Array.isArray(selections)) {
            return res.status(400).json(new ApiResponse(400, null, "يرجى اختيار الأسئلة"));
        }

        const exam = await ExamService.startCustomTest(user_id, selections);
        res.status(201).json(new ApiResponse(201, exam, "تم بدء الاختبار المخصص"));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

// Submit exam
export const submitExam = async (req, res) => {
    try {
        const user_id = new mongoose.Types.ObjectId(req.user.userId);
        const { exam_id } = req.params;
        const { answers, time_spent } = req.body;  // Get from req.body

        // Pass in correct order: exam_id, user_id, then data object
        const result = await ExamService.submitExam(exam_id, user_id, {
            answers,
            time_spent: time_spent || 0
        });
        
        res.status(200).json(new ApiResponse(200, result, "تم تسليم الاختبار"));
    } catch (error) {
        console.error("Submit exam error:", error);
        res.status(500).json(new ApiResponse(500, null, error.message));
    }
};
// Get exam stats
export const getExamStats = async (req, res) => {
    try {
        const user_id = new mongoose.Types.ObjectId(req.user.userId);
        const stats = await ExamService.getExamStats(user_id);
        res.status(200).json(new ApiResponse(200, stats, "تم جلب إحصائيات الاختبارات"));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

// Get exam history
export const getExamHistory = async (req, res) => {
    try {
        const user_id = new mongoose.Types.ObjectId(req.user.userId);
        const history = await ExamService.getExamHistory(user_id);
        res.status(200).json(new ApiResponse(200, history, "تم جلب سجل الاختبارات"));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

// Get exam details
export const getExamDetails = async (req, res) => {
    try {
        const user_id = new mongoose.Types.ObjectId(req.user.userId);
        const { exam_id } = req.params;

        const exam = await ExamService.getExamDetails(user_id, exam_id);
        res.status(200).json(new ApiResponse(200, exam, "تم جلب تفاصيل الاختبار"));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, error.message));
    }
};