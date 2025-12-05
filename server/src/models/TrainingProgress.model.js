import mongoose from "mongoose";

const trainingProgressSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        internal_type_id: {
            type: Number,
            required: true
        },
        last_question_index: {
            type: Number,
            default: 0
        },
        started_at: {
            type: Date,
            default: Date.now
        },
        last_activity: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

// One progress per user per internal_type
trainingProgressSchema.index({ user_id: 1, internal_type_id: 1 }, { unique: true });

export default mongoose.model("TrainingProgress", trainingProgressSchema);