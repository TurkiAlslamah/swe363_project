import express from "express";
import { register, login, getProfile, logout } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes (require token)
router.get("/profile", protect, getProfile);
router.post("/logout", protect, logout);

export default router;