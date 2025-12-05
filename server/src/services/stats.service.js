import TrainingAttempt from "../models/TrainingAttempt.model.js";
import TrainingProgress from "../models/TrainingProgress.model.js";
import SavedQuestion from "../models/SavedQuestion.model.js";
import Exam from "../models/Exam.model.js";
import InternalType from "../models/InternalType.model.js";

class StatsService {
    // Get all stats for stats page
    async getFullStats(user_id) {
        // ============ TRAINING STATS (Image 1) ============
        const trainingAttempts = await TrainingAttempt.find({ user_id });
        
        const total_questions = trainingAttempts.length;
        const correct_answers = trainingAttempts.filter(a => a.is_correct).length;
        const wrong_answers = total_questions - correct_answers;
        const accuracy_percentage = total_questions > 0 
            ? Math.round((correct_answers / total_questions) * 100 * 10) / 10 
            : 0;

        // ============ PERFORMANCE BY INTERNAL TYPE (Image 2) ============
        const internalTypes = await InternalType.find();
        
        const performanceByType = await Promise.all(
            internalTypes.map(async (type) => {
                const attempts = trainingAttempts.filter(
                    a => a.internal_type_id === type.internal_type_id
                );
                const total = attempts.length;
                const correct = attempts.filter(a => a.is_correct).length;
                const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

                return {
                    internal_type_id: type.internal_type_id,
                    type_id: type.type_id,
                    internal_name: type.internal_name,
                    internal_name_en: type.internal_name_en,
                    total_questions: total,
                    correct_answers: correct,
                    percentage
                };
            })
        );

        // ============ EXAM STATS (Image 3 - top) ============
        const completedExams = await Exam.find({ user_id, status: "completed" });
        
        const total_exams = completedExams.length;
        const total_exam_questions = completedExams.reduce((sum, e) => sum + e.total_questions, 0);
        const total_exam_correct = completedExams.reduce((sum, e) => sum + e.correct_count, 0);
        const exam_average = total_exams > 0 
            ? Math.round(completedExams.reduce((sum, e) => sum + e.score_percentage, 0) / total_exams)
            : 0;
        const exam_best = total_exams > 0 
            ? Math.max(...completedExams.map(e => e.score_percentage))
            : 0;

        // ============ ACTIVITY & STREAKS (Image 3 - bottom) ============
        
        // This week questions (from training)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const this_week_attempts = trainingAttempts.filter(
            a => new Date(a.attempted_at) >= oneWeekAgo
        );
        const this_week_questions = this_week_attempts.length;
        const this_week_correct = this_week_attempts.filter(a => a.is_correct).length;
        const this_week_percentage = this_week_questions > 0 
            ? Math.round((this_week_correct / this_week_questions) * 100)
            : 0;

        // Calculate streaks from training progress
        const progressRecords = await TrainingProgress.find({ user_id }).sort({ last_activity: -1 });
        
        // Get unique activity dates
        const activityDates = [...new Set(
            trainingAttempts.map(a => 
                new Date(a.attempted_at).toISOString().split('T')[0]
            )
        )].sort().reverse();

        // Calculate current streak
        let current_streak = 0;
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        if (activityDates.includes(today) || activityDates.includes(yesterday)) {
            let checkDate = activityDates.includes(today) ? new Date() : new Date(Date.now() - 86400000);
            
            for (let i = 0; i < activityDates.length; i++) {
                const dateStr = checkDate.toISOString().split('T')[0];
                if (activityDates.includes(dateStr)) {
                    current_streak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                } else {
                    break;
                }
            }
        }

        // Calculate longest streak
        let longest_streak = 0;
        let tempStreak = 0;
        
        for (let i = 0; i < activityDates.length; i++) {
            if (i === 0) {
                tempStreak = 1;
            } else {
                const prevDate = new Date(activityDates[i - 1]);
                const currDate = new Date(activityDates[i]);
                const diffDays = Math.round((prevDate - currDate) / 86400000);
                
                if (diffDays === 1) {
                    tempStreak++;
                } else {
                    longest_streak = Math.max(longest_streak, tempStreak);
                    tempStreak = 1;
                }
            }
        }
        longest_streak = Math.max(longest_streak, tempStreak);

        // ============ REVIEW COUNTS (Image 4) ============
        const wrong_answers_count = wrong_answers;
        const saved_questions_count = await SavedQuestion.countDocuments({ user_id });

        return {
            // Training Stats (Image 1)
            training_stats: {
                total_questions,
                correct_answers,
                wrong_answers,
                accuracy_percentage
            },
            // Performance by Type (Image 2)
            performance_by_type: performanceByType,
            // Exam Stats (Image 3 - top)
            exam_stats: {
                total_exams,
                total_questions: total_exam_questions,
                correct_answers: total_exam_correct,
                average_score: exam_average,
                best_score: exam_best
            },
            // Activity & Streaks (Image 3 - bottom)
            activity: {
                current_streak,
                longest_streak,
                this_week_questions,
                this_week_percentage
            },
            // Review Counts (Image 4)
            review: {
                wrong_answers_count,
                saved_questions_count
            }
        };
    }
}

export default new StatsService();