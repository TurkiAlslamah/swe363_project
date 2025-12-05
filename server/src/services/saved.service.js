import SavedQuestion from "../models/SavedQuestion.model.js";
import ApiError from "../utils/ApiError.js";

class SavedService {
    // Get all saved questions for user
    async getSavedQuestions(user_id) {
        const saved = await SavedQuestion.find({ user_id })
            .populate("question_id")
            .sort({ createdAt: -1 });

        return {
            total: saved.length,
            saved_questions: saved
        };
    }

    // Save question
    async saveQuestion(user_id, question_id) {
        const exists = await SavedQuestion.findOne({ user_id, question_id });
        if (exists) {
            throw new ApiError(400, "السؤال محفوظ بالفعل");
        }

        return await SavedQuestion.create({ user_id, question_id });
    }

    // Unsave question
    async unsaveQuestion(user_id, question_id) {
        const deleted = await SavedQuestion.findOneAndDelete({ user_id, question_id });
        if (!deleted) {
            throw new ApiError(404, "السؤال غير موجود في المحفوظات");
        }
        return deleted;
    }

    // Check if question is saved
    async isQuestionSaved(user_id, question_id) {
        const exists = await SavedQuestion.findOne({ user_id, question_id });
        return !!exists;
    }
}

export default new SavedService();