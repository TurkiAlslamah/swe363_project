import User from "../models/User.model.js";
import TrainingAttempt from "../models/TrainingAttempt.model.js";
import TrainingProgress from "../models/TrainingProgress.model.js";
import Exam from "../models/Exam.model.js";
import ApiError from "../utils/ApiError.js";

class StudentService {
    // Get all students
    // NOTE: This function ONLY READS from the database. It does NOT modify any user data.
    // Student = any user with type === "student" (not "role")
    async getAllStudents() {
        const students = await User.find({ type: "student" })
            .select("_id fullName email createdAt")
            .sort({ createdAt: 1 }); // Sort by creation date for sequential student_id
        
        // Generate sequential student_id based on creation order (read-only, no DB writes)
        return students.map((student, index) => ({
            _id: student._id,
            name: student.fullName, // Use fullName as stored in DB
            email: student.email,
            student_id: `2021${String(index + 1).padStart(3, '0')}` // Format: 2021001, 2021002, etc.
        }));
    }

    // Get student by ID
    async getStudentById(id) {
        const student = await User.findOne({ _id: id, type: "student" })
            .select("_id fullName email createdAt");
        
        if (!student) {
            throw new ApiError(404, "الطالب غير موجود");
        }

        // Get all students to calculate student_id
        const allStudents = await User.find({ type: "student" })
            .select("_id createdAt")
            .sort({ createdAt: 1 });
        
        const index = allStudents.findIndex(s => s._id.toString() === id.toString());
        const student_id = `2021${String(index + 1).padStart(3, '0')}`;

        return {
            _id: student._id,
            name: student.fullName,
            email: student.email,
            student_id
        };
    }

    // Get student performance
    async getStudentPerformance(studentId) {
        // Verify student exists
        const student = await User.findOne({ _id: studentId, type: "student" });
        if (!student) {
            throw new ApiError(404, "الطالب غير موجود");
        }

        // Get all training attempts
        const trainingAttempts = await TrainingAttempt.find({ user_id: studentId });
        
        const total_questions = trainingAttempts.length;
        const correct_answers = trainingAttempts.filter(a => a.is_correct).length;
        const wrong_answers = total_questions - correct_answers;
        const accuracy_percentage = total_questions > 0 
            ? Math.round((correct_answers / total_questions) * 100 * 10) / 10 
            : 0;

        // Get last activity from TrainingProgress
        const lastProgress = await TrainingProgress.findOne({ user_id: studentId })
            .sort({ last_activity: -1 });

        // Get last exam activity
        const lastExam = await Exam.findOne({ user_id: studentId })
            .sort({ completed_at: -1 });

        const lastActivity = lastProgress?.last_activity || lastExam?.completed_at || student.createdAt;

        return {
            total_questions,
            correct_answers,
            wrong_answers,
            accuracy_percentage,
            last_activity: lastActivity
        };
    }
}

export default new StudentService();

