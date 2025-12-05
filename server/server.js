import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/config/db.config.js";
import errorHandler from "./src/middlewares/error.middleware.js";
import questionRoutes from "./src/routes/question.routes.js";
import trainingRoutes from "./src/routes/training.routes.js";
import savedRoutes from "./src/routes/saved.routes.js";
import examRoutes from "./src/routes/exam.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import authRoutes from "./src/routes/auth.routes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
    res.json({ message: "Qdrat API is running 🚀" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/training", trainingRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/admin", adminRoutes);

// Error handler 
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
});