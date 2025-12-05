import StatsService from "../services/stats.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

// Get full stats for stats page
export const getFullStats = asyncHandler(async (req, res) => {
    const user_id = new mongoose.Types.ObjectId(req.user.userId);

    const stats = await StatsService.getFullStats(user_id);
    res.status(200).json(new ApiResponse(200, stats, "تم جلب الإحصائيات"));
});