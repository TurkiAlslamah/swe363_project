import express from "express";
import { 
    createReport, 
    getAllReports, 
    updateReportStatus,
    deleteReport 
} from "../controllers/report.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import ApiError from "../utils/ApiError.js";

const router = express.Router();

// Admin/Teacher only middleware
const adminOrTeacher = (req, res, next) => {
    if (req.user.type !== "admin" && req.user.type !== "teacher") {
        throw new ApiError(403, "غير مصرح لك بالوصول");
    }
    next();
};

// Student routes
router.post("/", protect, createReport);

// Admin/Teacher routes
router.get("/", protect, adminOrTeacher, getAllReports);
router.put("/:report_id/status", protect, adminOrTeacher, updateReportStatus);
router.delete("/:report_id", protect, adminOrTeacher, deleteReport);

export default router;