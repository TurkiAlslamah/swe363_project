import mongoose from "mongoose";

const internalTypeSchema = new mongoose.Schema(
    {
        internal_type_id: {
            type: Number,
            required: true,
            unique: true
        },
        type_id: {
            type: Number,
            required: true,
            enum: [1, 2]
        },
        internal_name: {
            type: String,
            required: true
        },
        internal_name_en: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("InternalType", internalTypeSchema);