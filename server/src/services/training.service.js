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
        if (internal_type_id) query.internal_type_id = parseInt(internal_type_id);

        const wrongAttempts = await TrainingAttempt.find(query)
            .populate("question_id")
            .sort({ attempted_at: -1 });

        // Get internal type names
        const InternalType = (await import("../models/InternalType.model.js")).default;
        
        // Format response with question details
        const wrongAnswers = await Promise.all(
            wrongAttempts.map(async (attempt) => {
                const internalType = await InternalType.findOne({ 
                    internal_type_id: attempt.internal_type_id 
                });

                return {
                    _id: attempt._id,
                    question: attempt.question_id,
                    internal_type_id: attempt.internal_type_id,
                    internal_name: internalType?.internal_name || "",
                    internal_name_en: internalType?.internal_name_en || "",
                    user_answer: attempt.user_answer,
                    correct_answer: attempt.question_id?.correct_answer,
                    attempted_at: attempt.attempted_at
                };
            })
        );

        return {
            total_wrong: wrongAnswers.length,
            wrong_answers: wrongAnswers
        };
    }

    // ============ TRAINING OVERVIEW (For Training Page) ============
    
    // Get single question by index
    async getQuestionByIndex(user_id, internal_type_id, index) {
        // Get all questions for this internal_type (sorted)
        const questions = await Question.find({ internal_type_id })
            .populate("passage_id")
            .sort({ q_no: 1 });

        if (questions.length === 0) {
            throw new ApiError(404, "لا توجد أسئلة لهذا النوع");
        }

        if (index < 0 || index >= questions.length) {
            throw new ApiError(400, "رقم السؤال غير صحيح");
        }

        const question = questions[index];

        // Check if user already attempted this question
        const attempt = await TrainingAttempt.findOne({
            user_id,
            question_id: question._id
        });

        return {
            internal_type_id: internal_type_id,
            current_index: index,
            total_questions: questions.length,
            is_last: index === questions.length - 1,
            is_first: index === 0,
            question: {
                ...question.toObject(),
                attempted: !!attempt,
                attempt_info: attempt ? {
                    user_answer: attempt.user_answer,
                    is_correct: attempt.is_correct,
                    attempted_at: attempt.attempted_at
                } : null
            }
        };
    }

    // Get training overview for all internal types
    async getTrainingOverview(user_id, type_id = null) {
        // Get all internal types (optionally filtered by type_id)
        const InternalType = (await import("../models/InternalType.model.js")).default;
        
        const query = type_id ? { type_id: parseInt(type_id) } : {};
        const internalTypes = await InternalType.find(query).sort({ internal_type_id: 1 });

        const overview = await Promise.all(
            internalTypes.map(async (internalType) => {
                // Get total questions for this internal_type
                const totalQuestions = await Question.countDocuments({ 
                    internal_type_id: internalType.internal_type_id 
                });

                // Get user's progress
                const progress = await TrainingProgress.findOne({ 
                    user_id, 
                    internal_type_id: internalType.internal_type_id 
                });

                // Get completed (attempted) questions count
                const completedQuestions = await TrainingAttempt.countDocuments({
                    user_id,
                    internal_type_id: internalType.internal_type_id
                });

                // Calculate percentage
                const percentage = totalQuestions > 0 
                    ? Math.round((completedQuestions / totalQuestions) * 100) 
                    : 0;

                return {
                    internal_type_id: internalType.internal_type_id,
                    type_id: internalType.type_id,
                    internal_name: internalType.internal_name,
                    internal_name_en: internalType.internal_name_en,
                    total_questions: totalQuestions,
                    completed_questions: completedQuestions,
                    percentage: percentage,
                    last_question_index: progress?.last_question_index || 0,
                    last_activity: progress?.last_activity || null
                };
            })
        );

        return overview;
    }

    // Get single internal type training data with questions
    async getTrainingByInternalType(user_id, internal_type_id) {
        // Get internal type info
        const InternalType = (await import("../models/InternalType.model.js")).default;
        const internalType = await InternalType.findOne({ internal_type_id });
        
        if (!internalType) {
            throw new ApiError(404, "النوع الفرعي غير موجود");
        }

        // Get all questions for this internal_type
        const questions = await Question.find({ internal_type_id })
            .populate("passage_id")
            .sort({ q_no: 1 });

        // Get user's progress
        const progress = await TrainingProgress.findOne({ user_id, internal_type_id });

        // Get user's attempts for these questions
        const attempts = await TrainingAttempt.find({ 
            user_id, 
            internal_type_id 
        });

        // Create a map of attempted questions
        const attemptedMap = {};
        attempts.forEach(attempt => {
            attemptedMap[attempt.question_id.toString()] = {
                user_answer: attempt.user_answer,
                is_correct: attempt.is_correct,
                attempted_at: attempt.attempted_at
            };
        });

        // Add attempt info to questions
        const questionsWithStatus = questions.map((q, index) => ({
            ...q.toObject(),
            index: index,
            attempted: !!attemptedMap[q._id.toString()],
            attempt_info: attemptedMap[q._id.toString()] || null
        }));

        return {
            internal_type_id: internalType.internal_type_id,
            type_id: internalType.type_id,
            internal_name: internalType.internal_name,
            internal_name_en: internalType.internal_name_en,
            total_questions: questions.length,
            completed_questions: attempts.length,
            percentage: questions.length > 0 
                ? Math.round((attempts.length / questions.length) * 100) 
                : 0,
            last_question_index: progress?.last_question_index || 0,
            questions: questionsWithStatus
        };
    }
}

export default new TrainingService();