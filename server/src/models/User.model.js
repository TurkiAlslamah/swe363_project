import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "البريد الإلكتروني مطلوب"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: [true, "الاسم الكامل مطلوب"],
            trim: true,
        },
        password_hash: {
            type: String,
            required: [true, "كلمة المرور مطلوبة"],
        },
        type: {
            type: String,
            enum: ["student", "teacher", "admin"],
            default: "student",
        },
          status: {
      type: String,
      enum: ["نشط", "غير نشط", "محظور"],
      default: "نشط"
        }
    },
    { timestamps: true }
);

// Don't return password_hash in JSON responses
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password_hash;
    return user;
};

export default mongoose.model("User", userSchema);