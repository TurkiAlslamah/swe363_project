import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema(
    {
        student_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        teacher_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        }
    },
    { timestamps: true }
);

// Index for faster queries
evaluationSchema.index({ student_id: 1, createdAt: -1 });
evaluationSchema.index({ teacher_id: 1, createdAt: -1 });

export default mongoose.model("Evaluation", evaluationSchema);

