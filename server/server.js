import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/config/db.config.js";
import errorHandler from "./src/middlewares/error.middleware.js";
import questionRoutes from "./src/routes/question.routes.js";
import trainingRoutes from "./src/routes/training.routes.js";

// Import routes
import authRoutes from "./src/routes/auth.routes.js";

// Load env variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({ message: "Qdrat API is running 🚀" });
});
app.use("/api/questions", questionRoutes);
// Error handler (must be last)
app.use(errorHandler);
app.use("/api/training", trainingRoutes);


// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
});