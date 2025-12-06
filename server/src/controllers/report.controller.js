import ReportService from "../services/report.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

// Create report (Student)
export const createReport = asyncHandler(async (req, res) => {
    const user_id = new mongoose.Types.ObjectId(req.user.userId);
    const { q_no, report_text } = req.body;

    if (!q_no || !report_text) {
        return res.status(400).json(new ApiResponse(400, null, "يرجى إدخال جميع الحقول"));
    }

    const report = await ReportService.createReport(user_id, q_no, report_text);
    res.status(201).json(new ApiResponse(201, report, "تم إرسال التبليغ بنجاح"));
});

// Get all reports (Admin)
export const getAllReports = asyncHandler(async (req, res) => {
    const reports = await ReportService.getAllReports();
    res.status(200).json(new ApiResponse(200, reports, "تم جلب التبليغات"));
});

// Update report status (Admin)
export const updateReportStatus = asyncHandler(async (req, res) => {
    const admin_id = new mongoose.Types.ObjectId(req.user.userId);
    const { report_id } = req.params;
    const { status, admin_notes } = req.body;

    if (!["solved", "ignored"].includes(status)) {
        return res.status(400).json(new ApiResponse(400, null, "الحالة غير صحيحة"));
    }

    const report = await ReportService.updateReportStatus(report_id, admin_id, status, admin_notes);
    res.status(200).json(new ApiResponse(200, report, "تم تحديث حالة التبليغ"));
});

// Delete report (Admin)
export const deleteReport = asyncHandler(async (req, res) => {
    const { report_id } = req.params;
    
    await ReportService.deleteReport(report_id);
    res.status(200).json(new ApiResponse(200, null, "تم حذف التبليغ"));
});