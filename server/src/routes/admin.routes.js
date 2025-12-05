import express from "express";
import {
    getDashboard,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getQuestions,
    approveQuestion,
    rejectQuestion,
    deleteQuestion,
    updateQuestion

} from "../controllers/admin.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import ApiError from "../utils/ApiError.js";

const router = express.Router();

// Admin only middleware
const adminOnly = (req, res, next) => {
    if (req.user.type !== "admin") {
        throw new ApiError(403, "غير مصرح لك بالوصول");
    }
    next();
};

router.use(protect);
router.use(adminOnly);

// Dashboard
router.get("/dashboard", getDashboard);

// Users
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Questions
router.get("/questions", getQuestions);
router.put("/questions/:id/approve", approveQuestion);
router.put("/questions/:id/reject", rejectQuestion);
router.delete("/questions/:id", deleteQuestion);
router.put("/questions/:id", updateQuestion);
export default router;