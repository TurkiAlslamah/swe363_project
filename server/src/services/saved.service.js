import SavedQuestion from "../models/Savedquestion.model.js";
import Question from "../models/Question.model.js";
import ApiError from "../utils/ApiError.js";

class SavedService {
    // Get all saved questions for user
    async getSavedQuestions(user_id) {
        const savedQuestions = await SavedQuestion.find({ user_id })
            .sort({ createdAt: -1 });

        // Get full question details
        const questionsWithDetails = await Promise.all(
            savedQuestions.map(async (saved) => {
                const question = await Question.findOne({ q_no: saved.q_no });
                return {
                    _id: saved._id,
                    q_no: saved.q_no,
                    question: question,
                    saved_at: saved.createdAt
                };
            })
        );

        return questionsWithDetails;
    }

    // Save question
    async saveQuestion(user_id, q_no) {
        // Check if question exists
        const question = await Question.findOne({ q_no });
        if (!question) {
            throw new ApiError(404, "السؤال غير موجود");
        }

        // Check if already saved
        const existing = await SavedQuestion.findOne({ user_id, q_no });
        if (existing) {
            throw new ApiError(400, "السؤال محفوظ بالفعل");
        }

        const saved = await SavedQuestion.create({ user_id, q_no });
        return saved;
    }

    // Unsave question
    async unsaveQuestion(user_id, q_no) {
        const result = await SavedQuestion.findOneAndDelete({ user_id, q_no });
        if (!result) {
            throw new ApiError(404, "السؤال غير محفوظ");
        }
        return result;
    }

    // Check if question is saved
    async isQuestionSaved(user_id, q_no) {
        const saved = await SavedQuestion.findOne({ user_id, q_no });
        return !!saved;
    }
} 

export default new SavedService();