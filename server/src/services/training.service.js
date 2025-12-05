import TrainingAttempt from "../models/TrainingAttempt.model.js";
import TrainingProgress from "../models/TrainingProgress.model.js";
import Question from "../models/Question.model.js";
import ApiError from "../utils/ApiError.js";

class TrainingService {
    // ============ PROGRESS ============
    
    // Get or create progress for user + internal_type
    async getProgress(user_id, internal_type_id) {
        let progress = await TrainingProgress.findOne({ user_id, internal_type_id });
        
        if (!progress) {
            progress = await TrainingProgress.create({
                user_id,
                internal_type_id,
                last_question_index: 0
            });
        }
        
        return progress;
    }

    // Get all progress for user
    async getAllProgressByUser(user_id) {
        return await TrainingProgress.find({ user_id }).sort({ internal_type_id: 1 });
    }

    // Update progress
    async updateProgress(user_id, internal_type_id, last_question_index) {
        const progress = await TrainingProgress.findOneAndUpdate(
            { user_id, internal_type_id },
            { 
                last_question_index,
                last_activity: Date.now()
            },
            { new: true, upsert: true }
        );
        return progress;
    }

    // Reset progress
    async resetProgress(user_id, internal_type_id) {
        const progress = await TrainingProgress.findOneAndUpdate(
            { user_id, internal_type_id },
            { 
                last_question_index: 0,
                started_at: Date.now(),
                last_activity: Date.now()
            },
            { new: true }
        );
        return progress;
    }

    // ============ ATTEMPTS ============

    // Save attempt
    async saveAttempt(data) {
        const { user_id, question_id, q_no, internal_type_id, user_answer } = data;

        // Get correct answer from question
        const question = await Question.findById(question_id);
        if (!question) {
            throw new ApiError(404, "السؤال غير موجود");
        }

        const is_correct = question.correct_answer === user_answer;

        const attempt = await TrainingAttempt.create({
            user_id,
            question_id,
            q_no,
            internal_type_id,
            user_answer,
            is_correct
        });

        return attempt;
    }

    // Get attempts by user
    async getAttemptsByUser(user_id) {
        return await TrainingAttempt.find({ user_id })
            .populate("question_id")
            .sort({ attempted_at: -1 });
    }

    // Get attempts by user + internal_type
    async getAttemptsByUserAndType(user_id, internal_type_id) {
        return await TrainingAttempt.find({ user_id, internal_type_id })
            .populate("question_id")
            .sort({ attempted_at: -1 });
    }

    // ============ STATS ============

    // Get stats for user
    async getUserStats(user_id) {
        const stats = await TrainingAttempt.aggregate([
            { $match: { user_id: user_id } },
            {
                $group: {
                    _id: "$internal_type_id",
                    total: { $sum: 1 },
                    correct: { $sum: { $cond: ["$is_correct", 1, 0] } }
                }
            },
            {
                $project: {
                    internal_type_id: "$_id",
                    total: 1,
                    correct: 1,
                    percentage: { 
                        $multiply: [{ $divide: ["$correct", "$total"] }, 100] 
                    }
                }
            },
            { $sort: { internal_type_id: 1 } }
        ]);

        return stats;
    }

    // Get overall stats for user
    async getOverallStats(user_id) {
        const stats = await TrainingAttempt.aggregate([
            { $match: { user_id: user_id } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    correct: { $sum: { $cond: ["$is_correct", 1, 0] } }
                }
            },
            {
                $project: {
                    _id: 0,
                    total: 1,
                    correct: 1,
                    wrong: { $subtract: ["$total", "$correct"] },
                    percentage: { 
                        $multiply: [{ $divide: ["$correct", "$total"] }, 100] 
                    }
                }
            }
        ]);

        return stats[0] || { total: 0, correct: 0, wrong: 0, percentage: 0 };
    }

    // Get wrong answers for review
    async getWrongAnswers(user_id, internal_type_id = null) {
        const query = { user_id, is_correct: false };
        if (internal_type_id) query.internal_type_id = internal_type_id;

        return await TrainingAttempt.find(query)
            .populate("question_id")
            .sort({ attempted_at: -1 });
    }
}

export default new TrainingService();