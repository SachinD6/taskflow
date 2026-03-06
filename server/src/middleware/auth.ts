import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser, UserRole } from "../models/User";
import ApiError from "../utils/ApiError";

export interface AuthRequest extends Request {
    user?: IUser;
}

interface JwtPayload {
    id: string;
    role: UserRole;
}

/**
 * Verifies the JWT from the Authorization header
 * and attaches the user document to req.user.
 */
export const protect = async (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let token: string | undefined;

        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        if (!token) {
            return next(ApiError.unauthorized("Not authenticated – token missing"));
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return next(ApiError.internal("JWT_SECRET not configured"));
        }

        const decoded = jwt.verify(token, secret) as JwtPayload;

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return next(ApiError.unauthorized("User no longer exists"));
        }

        req.user = user;
        next();
    } catch (err: any) {
        if (err.name === "TokenExpiredError") {
            return next(ApiError.unauthorized("Token expired"));
        }
        if (err.name === "JsonWebTokenError") {
            return next(ApiError.unauthorized("Invalid token"));
        }
        next(err);
    }
};

/**
 * Restricts access to users with one of the specified roles.
 */
export const authorise = (...roles: UserRole[]) => {
    return (req: AuthRequest, _res: Response, next: NextFunction): void => {
        if (!req.user) {
            return next(ApiError.unauthorized());
        }

        if (!roles.includes(req.user.role)) {
            return next(
                ApiError.forbidden("You do not have permission to perform this action")
            );
        }

        next();
    };
};
