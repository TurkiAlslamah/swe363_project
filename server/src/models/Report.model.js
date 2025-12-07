import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        q_no: {
            type: Number,
            required: true
        },
        report_text: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ["pending", "solved", "ignored"],
            default: "pending"
        },
        admin_notes: {
            type: String,
            default: null
        },
        reviewed_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        reviewed_at: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

export default mongoose.model("Report", reportSchema);