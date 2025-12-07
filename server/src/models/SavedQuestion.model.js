import mongoose from "mongoose";

const savedQuestionSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        q_no: {  
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

// One save per user per question
savedQuestionSchema.index({ user_id: 1, q_no: 1 }, { unique: true });

export default mongoose.model("SavedQuestion", savedQuestionSchema);