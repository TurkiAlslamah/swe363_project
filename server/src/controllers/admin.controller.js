import AdminService from "../services/admin.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Dashboard
export const getDashboard = asyncHandler(async (req, res) => {
    const stats = await AdminService.getDashboardStats();
    res.status(200).json(new ApiResponse(200, stats, "تم جلب الإحصائيات"));
});

// Users
export const getUsers = asyncHandler(async (req, res) => {
    const users = await AdminService.getUsers(req.query.type);
    res.status(200).json(new ApiResponse(200, users, "تم جلب المستخدمين"));
});

export const getUserById = asyncHandler(async (req, res) => {
    const user = await AdminService.getUserById(req.params.id);
    res.status(200).json(new ApiResponse(200, user, "تم جلب المستخدم"));
});

export const updateUser = asyncHandler(async (req, res) => {
    const user = await AdminService.updateUser(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, user, "تم تحديث المستخدم"));
});

export const deleteUser = asyncHandler(async (req, res) => {
    await AdminService.deleteUser(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "تم حذف المستخدم"));
});

// Questions
export const getQuestions = asyncHandler(async (req, res) => {
    const questions = await AdminService.getQuestions(req.query.status);
    res.status(200).json(new ApiResponse(200, questions, "تم جلب الأسئلة"));
});

export const approveQuestion = asyncHandler(async (req, res) => {
    const question = await AdminService.approveQuestion(req.params.id);
    res.status(200).json(new ApiResponse(200, question, "تم اعتماد السؤال"));
});

export const rejectQuestion = asyncHandler(async (req, res) => {
    const question = await AdminService.rejectQuestion(req.params.id);
    res.status(200).json(new ApiResponse(200, question, "تم رفض السؤال"));
});

export const deleteQuestion = asyncHandler(async (req, res) => {
    await AdminService.deleteQuestion(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "تم حذف السؤال"));
});
export const updateQuestion = asyncHandler(async (req, res) => {
    const question = await AdminService.updateQuestion(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, question, "تم تحديث السؤال"));
});