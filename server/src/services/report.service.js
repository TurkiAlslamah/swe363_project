import Report from "../models/Report.model.js";
import Question from "../models/Question.model.js";
import ApiError from "../utils/ApiError.js";

class ReportService {
    async createReport(user_id, q_no, report_text) {
        const report = await Report.create({
            user_id,
            q_no,
            report_text
        });
        return report;
    }

    async getAllReports() {
        const reports = await Report.find()
            .populate("user_id", "fullName email")
            .populate("reviewed_by", "fullName")
            .sort({ createdAt: -1 });

        // Get question details for each report
        const reportsWithQuestions = await Promise.all(
            reports.map(async (report) => {
                const question = await Question.findOne({ q_no: report.q_no });
                return {
                    _id: report._id,
                    report_number: report._id.toString().slice(-3), // Last 3 chars as #
                    q_no: report.q_no,
                    question_text: question?.question_text || "السؤال غير موجود",
                    question_type: question?.type_id === 1 ? "لفظي" : question?.type_id === 2 ? "كمي" : "غير محدد",
                    internal_type_id: question?.internal_type_id || null,
                    report_text: report.report_text,
                    status: report.status,
                    user_name: report.user_id?.fullName || "مستخدم محذوف",
                    user_email: report.user_id?.email || "",
                    admin_notes: report.admin_notes,
                    reviewed_by: report.reviewed_by?.fullName || null,
                    reviewed_at: report.reviewed_at,
                    created_at: report.createdAt,
                    updated_at: report.updatedAt
                };
            })
        );

        return reportsWithQuestions;
    }

    async updateReportStatus(report_id, admin_id, status, admin_notes) {
        const report = await Report.findById(report_id);
        
        if (!report) {
            throw new ApiError(404, "التبليغ غير موجود");
        }

        report.status = status;
        report.admin_notes = admin_notes || null;
        report.reviewed_by = admin_id;
        report.reviewed_at = new Date();
        
        await report.save();
        
        return report;
    }

    async deleteReport(report_id) {
        const report = await Report.findByIdAndDelete(report_id);
        
        if (!report) {
            throw new ApiError(404, "التبليغ غير موجود");
        }
        
        return report;
    }
}

export default new ReportService();