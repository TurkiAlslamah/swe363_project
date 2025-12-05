import mongoose from "mongoose";

const examAnswerSchema = new mongoose.Schema({
    question_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true
    },
    user_answer: {
        type: String,
        enum: ["a", "b", "c", "d", null],
        default: null
    },
    is_correct: {
        type: Boolean,
        default: false
    }
}, { _id: false });

const examSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        exam_type: {
            type: String,
            enum: ["daily", "custom"],
            required: true
        },
        // Questions and answers
        questions: [examAnswerSchema],
        // Results
        total_questions: {
            type: Number,
            required: true
        },
        correct_count: {
            type: Number,
            default: 0
        },
        wrong_count: {
            type: Number,
            default: 0
        },
        score_percentage: {
            type: Number,
            default: 0
        },
        // Time
        time_per_question: {
            type: Number,
            default: 30
        },
        total_time: {
            type: Number,
            default: 0
        },
        time_spent: {
            type: Number,
            default: 0
        },
        // Status
        status: {
            type: String,
            enum: ["in_progress", "completed"],
            default: "in_progress"
        },
        started_at: {
            type: Date,
            default: Date.now
        },
        completed_at: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

export default mongoose.model("Exam", examSchema);