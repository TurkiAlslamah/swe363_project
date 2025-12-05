import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error("Error:", err.message);

    // Handle ApiError
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            message: messages.join(", ")
        });
    }

    // Handle Mongoose duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: "البريد الإلكتروني مستخدم بالفعل"
        });
    }

    // Handle JWT errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            success: false,
            message: "التوكن غير صالح"
        });
    }

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            message: "انتهت صلاحية التوكن"
        });
    }

    // Default server error
    return res.status(500).json({
        success: false,
        message: "خطأ في السيرفر"
    });
};

export default errorHandler;