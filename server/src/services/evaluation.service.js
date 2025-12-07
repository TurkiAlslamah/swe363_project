import Evaluation from "../models/Evaluation.model.js";
import ApiError from "../utils/ApiError.js";

class EvaluationService {
    // Create evaluation
    async createEvaluation(data) {
        return await Evaluation.create(data);
    }

    // Get evaluations by student
    async getEvaluationsByStudent(studentId) {
        return await Evaluation.find({ student_id: studentId })
            .populate("teacher_id", "fullName email")
            .sort({ createdAt: -1 });
    }

    // Get evaluations by teacher
    async getEvaluationsByTeacher(teacherId) {
        return await Evaluation.find({ teacher_id: teacherId })
            .populate("student_id", "fullName email")
            .sort({ createdAt: -1 });
    }
}

export default new EvaluationService();

