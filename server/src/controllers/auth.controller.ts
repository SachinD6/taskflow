import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { AuthRequest } from "../middleware/auth";
import ApiResponse from "../utils/ApiResponse";

export class AuthController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await AuthService.register(req.body);
            ApiResponse.created(res, result, "User registered successfully");
        } catch (err) {
            next(err);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await AuthService.login(req.body);
            ApiResponse.success(res, result, "Login successful");
        } catch (err) {
            next(err);
        }
    }

    static async getMe(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = String(req.user!._id);
            const profile = await AuthService.getProfile(userId.toString());
            ApiResponse.success(res, profile);
        } catch (err) {
            next(err);
        }
    }
}
