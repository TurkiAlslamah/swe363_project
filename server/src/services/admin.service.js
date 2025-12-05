import User from "../models/User.model.js";
import Question from "../models/Question.model.js";
import ApiError from "../utils/ApiError.js";

class AdminService {
    // ============ DASHBOARD ============
    async getDashboardStats() {
        const total_questions = await Question.countDocuments();
        const total_students = await User.countDocuments({ type: "student" });
        const total_teachers = await User.countDocuments({ type: "teacher" });

        return {
            total_questions,
            total_students,
            total_teachers
        };
    }

    // ============ USERS ============
    async getUsers(type) {
        const query = type ? { type } : {};
        return await User.find(query).sort({ createdAt: -1 });
    }

    async getUserById(id) {
        const user = await User.findById(id);
        if (!user) throw new ApiError(404, "المستخدم غير موجود");
        return user;
    }

    async updateUser(id, data) {
        const user = await User.findByIdAndUpdate(id, data, { new: true });
        if (!user) throw new ApiError(404, "المستخدم غير موجود");
        return user;
    }

    async deleteUser(id) {
        const user = await User.findByIdAndDelete(id);
        if (!user) throw new ApiError(404, "المستخدم غير موجود");
        return user;
    }

    // ============ QUESTIONS ============
    async getQuestions(status) {
        const query = status ? { status } : {};
        return await Question.find(query).sort({ createdAt: -1 });
    }

    async approveQuestion(id) {
        const question = await Question.findByIdAndUpdate(
            id,
            { status: "مقبول" },
            { new: true }
        );
        if (!question) throw new ApiError(404, "السؤال غير موجود");
        return question;
    }

    async rejectQuestion(id) {
        const question = await Question.findByIdAndUpdate(
            id,
            { status: "مرفوض" },
            { new: true }
        );
        if (!question) throw new ApiError(404, "السؤال غير موجود");
        return question;
    }

    async deleteQuestion(id) {
        const question = await Question.findByIdAndDelete(id);
        if (!question) throw new ApiError(404, "السؤال غير موجود");
        return question;
    }
    async updateQuestion(id, data) {
    const question = await Question.findByIdAndUpdate(id, data, { new: true });
    if (!question) throw new ApiError(404, "السؤال غير موجود");
    return question;
}
}

export default new AdminService();