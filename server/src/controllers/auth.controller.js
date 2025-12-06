import AuthService from "../services/auth.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Register new user
export const register = asyncHandler(async (req, res) => {
    const { email, fullName, password } = req.body;

    // Validate required fields
    if (!email || !fullName || !password) {
        return res.status(400).json(
            new ApiResponse(400, null, "جميع الحقول مطلوبة")
        );
    }

    // Validate password length
    if (password.length < 6) {
        return res.status(400).json(
            new ApiResponse(400, null, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
        );
    }

    // Register user (type defaults to "student")
    const result = await AuthService.register({
        email,
        fullName,
        password,
        type: "student"  // Frontend register always creates students
    });

    res.status(201).json(
        new ApiResponse(201, result, "تم إنشاء الحساب بنجاح")
    );
});

// Login user
export const login = asyncHandler(async (req, res) => {
    const { email, password, type } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.status(400).json(
            new ApiResponse(400, null, "البريد الإلكتروني وكلمة المرور مطلوبان")
        );
    }

    const result = await AuthService.login({ email, password, type });

    res.status(200).json(
        new ApiResponse(200, result, "تم تسجيل الدخول بنجاح")
    );
});
export const updateQuestion = asyncHandler(async (req, res) => {
    const question = await AdminService.updateQuestion(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, question, "تم تحديث السؤال"));
});

// Get current user profile
export const getProfile = asyncHandler(async (req, res) => {
    const user = await AuthService.getProfile(req.user.userId);

    res.status(200).json(
        new ApiResponse(200, user, "تم جلب بيانات المستخدم")
    );
});

// Logout (client-side - just return success)
export const logout = asyncHandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, null, "تم تسجيل الخروج بنجاح")
    );
});