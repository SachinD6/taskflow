import { Response } from "express";

interface ApiResponsePayload<T> {
    success: boolean;
    message: string;
    data?: T;
    meta?: Record<string, unknown>;
}


class ApiResponse {
    static success<T>(
        res: Response,
        data: T,
        message = "Success",
        statusCode = 200,
        meta?: Record<string, unknown>
    ): Response {
        const payload: ApiResponsePayload<T> = {
            success: true,
            message,
            data,
        };
        if (meta) payload.meta = meta;
        return res.status(statusCode).json(payload);
    }

    static created<T>(res: Response, data: T, message = "Created"): Response {
        return ApiResponse.success(res, data, message, 201);
    }

    static error(
        res: Response,
        message: string,
        statusCode = 500
    ): Response {
        return res.status(statusCode).json({
            success: false,
            message,
        });
    }
}

export default ApiResponse;
