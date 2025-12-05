import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";

class AuthService {
    // Register new user
    async register({ email, fullName, password, type = "student" }) {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ApiError(400, "البريد الإلكتروني مستخدم بالفعل");
        }

        // Hash password with bcrypt (salt rounds = 10)
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Create new user
        const user = await User.create({
            email,
            fullName,
            password_hash,
            type
        });

        // Generate JWT token
        const token = this.generateToken(user._id, user.type);

        return {
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                type: user.type
            },
            token
        };
    }

    // Login user
    async login({ email, password, type }) {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(401, "البريد الإلكتروني أو كلمة المرور غير صحيحة");
        }

        // Check if user type matches (optional - for role-based login)
        if (type && user.type !== type) {
            throw new ApiError(401, "نوع المستخدم غير صحيح");
        }

        // Verify password with bcrypt
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            throw new ApiError(401, "البريد الإلكتروني أو كلمة المرور غير صحيحة");
        }

        // Generate JWT token
        const token = this.generateToken(user._id, user.type);

        return {
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                type: user.type
            },
            token
        };
    }

    // Get user profile
    async getProfile(userId) {
        const user = await User.findById(userId).select("-password_hash");
        if (!user) {
            throw new ApiError(404, "المستخدم غير موجود");
        }
        return user;
    }

    // Generate JWT token
    generateToken(userId, type) {
    return jwt.sign(
        { userId, type },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
}

    // Verify JWT token
    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new ApiError(401, "التوكن غير صالح أو منتهي الصلاحية");
        }
    }
}

export default new AuthService();