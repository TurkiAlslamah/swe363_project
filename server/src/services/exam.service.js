import Exam from "../models/Exam.model.js";
import Question from "../models/Question.model.js";
import ApiError from "../utils/ApiError.js";

class ExamService {
    // ============ DAILY TEST ============
    
    // Start daily test (15 لفظي + 15 كمي = 30 questions)
    async startDailyTest(user_id, time_per_question = 30) {
        // Get 15 random questions from type_id 1 (لفظي)
        const verbalQuestions = await Question.aggregate([
            { $match: { type_id: 1, status: "مقبول" } },
            { $sample: { size: 15 } }
        ]);

        // Get 15 random questions from type_id 2 (كمي)
        const quantQuestions = await Question.aggregate([
            { $match: { type_id: 2, status: "مقبول" } },
            { $sample: { size: 15 } }
        ]);

        const allQuestions = [...verbalQuestions, ...quantQuestions];

        if (allQuestions.length === 0) {
            throw new ApiError(404, "لا توجد أسئلة متاحة");
        }

        // Create exam
        const exam = await Exam.create({
            user_id,
            exam_type: "daily",
            questions: allQuestions.map(q => ({
                question_id: q._id,
                user_answer: null,
                is_correct: false
            })),
            total_questions: allQuestions.length,
            time_per_question,
            total_time: allQuestions.length * time_per_question
        });

        // Return exam with questions
        return {
            exam_id: exam._id,
            exam_type: "daily",
            total_questions: allQuestions.length,
            time_per_question,
            total_time: exam.total_time,
            questions: allQuestions
        };
    }

    // ============ CUSTOM TEST ============
    
    // Start custom test
    async startCustomTest(user_id, selections, time_per_question = 30) {
        // selections = [{ internal_type_id: 6, count: 5 }, { internal_type_id: 7, count: 3 }]
        
        let allQuestions = [];

        for (const selection of selections) {
            if (selection.count > 0) {
                const questions = await Question.aggregate([
                    { $match: { internal_type_id: selection.internal_type_id, status: "مقبول" } },
                    { $sample: { size: selection.count } }
                ]);
                allQuestions = [...allQuestions, ...questions];
            }
        }

        if (allQuestions.length === 0) {
            throw new ApiError(400, "يرجى اختيار عدد الأسئلة");
        }

        // Create exam
        const exam = await Exam.create({
            user_id,
            exam_type: "custom",
            questions: allQuestions.map(q => ({
                question_id: q._id,
                user_answer: null,
                is_correct: false
            })),
            total_questions: allQuestions.length,
            time_per_question,
            total_time: allQuestions.length * time_per_question
        });

        return {
            exam_id: exam._id,
            exam_type: "custom",
            total_questions: allQuestions.length,
            time_per_question,
            total_time: exam.total_time,
            questions: allQuestions
        };
    }

    // ============ SUBMIT EXAM ============
    
    async submitExam(user_id, exam_id, answers, time_spent) {
        // answers = [{ question_id: "...", user_answer: "a" }, ...]
        
        const exam = await Exam.findOne({ _id: exam_id, user_id });
        if (!exam) {
            throw new ApiError(404, "الاختبار غير موجود");
        }

        if (exam.status === "completed") {
            throw new ApiError(400, "الاختبار مكتمل بالفعل");
        }

        // Get correct answers
        const questionIds = exam.questions.map(q => q.question_id);
        const questions = await Question.find({ _id: { $in: questionIds } });
        
        const correctAnswersMap = {};
        questions.forEach(q => {
            correctAnswersMap[q._id.toString()] = q.correct_answer;
        });

        // Calculate results
        let correct_count = 0;
        let wrong_count = 0;

        const updatedQuestions = exam.questions.map(q => {
            const userAnswer = answers.find(a => a.question_id === q.question_id.toString());
            const correctAnswer = correctAnswersMap[q.question_id.toString()];
            const is_correct = userAnswer?.user_answer === correctAnswer;

            if (userAnswer?.user_answer) {
                if (is_correct) correct_count++;
                else wrong_count++;
            }

            return {
                question_id: q.question_id,
                user_answer: userAnswer?.user_answer || null,
                is_correct
            };
        });

        const score_percentage = Math.round((correct_count / exam.total_questions) * 100);

        // Update exam
        exam.questions = updatedQuestions;
        exam.correct_count = correct_count;
        exam.wrong_count = wrong_count;
        exam.score_percentage = score_percentage;
        exam.time_spent = time_spent;
        exam.status = "completed";
        exam.completed_at = new Date();
        await exam.save();

        return {
            exam_id: exam._id,
            total_questions: exam.total_questions,
            correct_count,
            wrong_count,
            score_percentage,
            time_spent
        };
    }

    // ============ EXAM STATS ============
    
    async getExamStats(user_id) {
        const exams = await Exam.find({ user_id, status: "completed" });

        if (exams.length === 0) {
            return {
                total_exams: 0,
                average_score: 0,
                best_score: 0,
                this_week: 0
            };
        }

        // Total exams
        const total_exams = exams.length;

        // Average score
        const totalScore = exams.reduce((sum, e) => sum + e.score_percentage, 0);
        const average_score = Math.round(totalScore / total_exams);

        // Best score
        const best_score = Math.max(...exams.map(e => e.score_percentage));

        // This week count
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const this_week = exams.filter(e => e.completed_at >= oneWeekAgo).length;

        return {
            total_exams,
            average_score,
            best_score,
            this_week
        };
    }

    // Get exam history
    async getExamHistory(user_id) {
        return await Exam.find({ user_id, status: "completed" })
            .select("-questions")
            .sort({ completed_at: -1 });
    }

    // Get exam details
    async getExamDetails(user_id, exam_id) {
        const exam = await Exam.findOne({ _id: exam_id, user_id })
            .populate("questions.question_id");
        
        if (!exam) {
            throw new ApiError(404, "الاختبار غير موجود");
        }

        return exam;
    }
}

export default new ExamService();