import mongoose from "mongoose";

const passageSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        passage_text: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("Passage", passageSchema);