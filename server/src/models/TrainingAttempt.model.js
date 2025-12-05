import mongoose from "mongoose";

const trainingAttemptSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        question_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true
        },
        q_no: {
            type: Number,
            required: true
        },
        internal_type_id: {
            type: Number,
            required: true
        },
        user_answer: {
            type: String,
            required: true,
            enum: ["a", "b", "c", "d"]
        },
        is_correct: {
            type: Boolean,
            required: true
        },
        attempted_at: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

// Index for faster queries
trainingAttemptSchema.index({ user_id: 1, internal_type_id: 1 });
trainingAttemptSchema.index({ user_id: 1, question_id: 1 });

export default mongoose.model("TrainingAttempt", trainingAttemptSchema);