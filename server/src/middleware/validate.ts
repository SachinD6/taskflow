import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import ApiError from "../utils/ApiError";

export const validate =
    (schema: ZodSchema, source: "body" | "query" = "body") =>
        (req: Request, _res: Response, next: NextFunction): void => {
            try {
                const data = schema.parse(req[source]);

                if (source === "body") {
                    req.body = data;
                } else {
                    (req as any).parsedQuery = data;
                }

                next();
            } catch (err) {
                if (err instanceof ZodError) {
                    const message = err.issues
                        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
                        .join(", ");
                    next(ApiError.badRequest(message));
                } else {
                    next(err);
                }
            }
        };
