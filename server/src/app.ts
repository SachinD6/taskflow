import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

import httpLogger from "./utils/logger";
import errorHandler from "./middleware/errorHandler";
import { swaggerSpec } from "./config/swagger";

import authRoutes from "./routes/v1/auth.routes";
import taskRoutes from "./routes/v1/task.routes";

const app = express();

// Disable ETag generation
app.set("etag", false);

// ==== Security ====
app.use(helmet());
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    })
);

// Rate limiting – 100 requests per 15 min window per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, try again later" },
});
app.use("/api", limiter);

// ##### Body parsing #####
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ##### Logging #####
app.use(httpLogger);

// ##### API Documentation #####
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ##### Routes (versioned) #####
// Disable ETag caching on API responses so clients always get fresh data
app.use("/api", (_req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);

// ##### Health check #####
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ##### 404 handler #####
app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

// ##### Global error handler ######
app.use(errorHandler);

export default app;
