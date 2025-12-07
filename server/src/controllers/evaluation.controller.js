import EvaluationService from "../services/evaluation.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Create evaluation
export const createEvaluation = asyncHandler(async (req, res) => {
    const { student_id, title, message } = req.body;
    const teacher_id = req.user._id; // From auth middleware

    if (!student_id || !title || !message) {
        return res.status(400).json(
            new ApiResponse(400, null, "جميع الحقول مطلوبة")
        );
    }

    const evaluation = await EvaluationService.createEvaluation({
        student_id,
        teacher_id,
        title,
        message
    });

    res.status(201).json(new ApiResponse(201, evaluation, "تم إرسال التقييم بنجاح"));
});

// Get evaluations by student
export const getEvaluationsByStudent = asyncHandler(async (req, res) => {
    const evaluations = await EvaluationService.getEvaluationsByStudent(req.params.id);
    res.status(200).json(new ApiResponse(200, evaluations, "تم جلب التقييمات بنجاح"));
});

// Get evaluations by teacher
export const getEvaluationsByTeacher = asyncHandler(async (req, res) => {
    const teacherId = req.user._id;
    const evaluations = await EvaluationService.getEvaluationsByTeacher(teacherId);
    res.status(200).json(new ApiResponse(200, evaluations, "تم جلب التقييمات بنجاح"));
});

