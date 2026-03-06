import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";

const errorHandler = (
    err: Error | ApiError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    // Mongoose validation error
    if (err.name === "ValidationError") {
        res.status(400).json({
            success: false,
            message: err.message,
        });
        return;
    }

    // Mongoose duplicate key error
    if ((err as any).code === 11000) {
        const field = Object.keys((err as any).keyValue || {})[0] || "field";
        res.status(409).json({
            success: false,
            message: `Duplicate value for ${field}`,
        });
        return;
    }

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        res.status(400).json({
            success: false,
            message: "Invalid resource ID",
        });
        return;
    }

    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
        return;
    }

    // Unexpected errors
    console.error("Unhandled Error:", err);
    res.status(500).json({
        success: false,
        message:
            process.env.NODE_ENV === "production"
                ? "Internal server error"
                : err.message,
    });
};

export default errorHandler;
