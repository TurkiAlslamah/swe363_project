import StudentService from "../services/student.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Get all students
// IMPORTANT: This endpoint returns ONLY JSON. No HTML, no redirects.
export const getAllStudents = asyncHandler(async (req, res) => {
    try {
        const students = await StudentService.getAllStudents();
        // Return JSON only - no res.send(), no res.render(), no redirect
        // ApiResponse will be serialized to JSON automatically
        return res.status(200).json(new ApiResponse(200, students, "تم جلب الطلاب بنجاح"));
    } catch (error) {
        // This should never happen due to asyncHandler, but just in case
        console.error('Error in getAllStudents:', error);
        throw error;
    }
});

// Get student by ID
export const getStudentById = asyncHandler(async (req, res) => {
    const student = await StudentService.getStudentById(req.params.id);
    res.status(200).json(new ApiResponse(200, student, "تم جلب الطالب بنجاح"));
});

// Get student performance
export const getStudentPerformance = asyncHandler(async (req, res) => {
    const performance = await StudentService.getStudentPerformance(req.params.id);
    res.status(200).json(new ApiResponse(200, performance, "تم جلب أداء الطالب بنجاح"));
});

