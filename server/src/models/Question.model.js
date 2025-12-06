import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        q_no: {
            type: Number,
            required: true,
            unique: true 
        },
        // Content
        is_question_text: {
            type: Boolean,
            required: true,
            default: true
        },
        question_text: {
            type: String,
            default: null
        },
        question_image: {
            type: String,
            default: null
        },
        // References
        type_id: {
            type: Number,
            required: true,
            enum: [1, 2]
        },
        internal_type_id: {
            type: Number,
            required: true
        },
        passage_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Passage",
            default: null
        },
        // Choices
        mc_a: {
            type: String,
            required: true
        },
        mc_b: {
            type: String,
            required: true
        },
        mc_c: {
            type: String,
            required: true
        },
        mc_d: {
            type: String,
            required: true
        },
        correct_answer: {
            type: String,
            required: true,
            enum: ["a", "b", "c", "d"]
        },
        // Extra
        explanation: {
            type: String,
            default: null
        },
        // Comparable
        is_comparable: {
            type: Boolean,
            default: false
        },
        comparable_option1_text: {
            type: String,
            default: null
        },
        comparable_option2_text: {
            type: String,
            default: null
        },
        // Visualization
        have_visualization: {
            type: Boolean,
            default: false
        },
        visualization_image_url: {
            type: String,
            default: null
        },
        // Status
        status: {
            type: String,
            enum: ["قيد المراجعة", "مقبول", "مرفوض"],
            default: "قيد المراجعة"
        }
    },
    { 
        timestamps: true,
        
    }
);

export default mongoose.model("Question", questionSchema);