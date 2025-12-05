import mongoose from "mongoose";

const questionTypeSchema = new mongoose.Schema(
    {
        type_id: {
            type: Number,
            required: true,
            unique: true,
            enum: [1, 2]
        },
        type_name: {
            type: String,
            required: true
        },
        type_name_en: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("QuestionType", questionTypeSchema);