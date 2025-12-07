import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error("Error:", err.message);
    console.error("Path:", req.path);
    console.error("Method:", req.method);

    // Handle ApiError - ALWAYS return JSON, never HTML
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            statusCode: err.statusCode
        });
    }

    // Handle Mongoose validation errors - ALWAYS return JSON
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            message: messages.join(", "),
            statusCode: 400
        });
    }

    // Handle Mongoose duplicate key error - ALWAYS return JSON
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: "البريد الإلكتروني مستخدم بالفعل",
            statusCode: 400
        });
    }

    // Handle JWT errors - ALWAYS return JSON
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            success: false,
            message: "التوكن غير صالح",
            statusCode: 401
        });
    }

    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            message: "انتهت صلاحية التوكن",
            statusCode: 401
        });
    }

    // Default server error - ALWAYS return JSON, never HTML
    return res.status(500).json({
        success: false,
        message: err.message || "خطأ في السيرفر",
        statusCode: 500
    });
};

export default errorHandler;