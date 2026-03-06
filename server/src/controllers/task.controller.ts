import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import { TaskService } from "../services/task.service";
import { UserRole } from "../models/User";
import ApiResponse from "../utils/ApiResponse";

export class TaskController {
    static async list(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user!._id.toString();
            const isAdmin = req.user!.role === UserRole.ADMIN;
            const result = await TaskService.list(userId, isAdmin, (req as any).parsedQuery);
            ApiResponse.success(res, result.tasks, "Tasks retrieved", 200, {
                pagination: result.pagination,
            });
        } catch (err) {
            next(err);
        }
    }

    static async getById(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user!._id.toString();
            const isAdmin = req.user!.role === UserRole.ADMIN;
            const taskId = req.params.id as string;
            const task = await TaskService.getById(taskId, userId, isAdmin);
            ApiResponse.success(res, task);
        } catch (err) {
            next(err);
        }
    }

    static async create(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user!._id.toString();
            const task = await TaskService.create(userId, req.body);
            ApiResponse.created(res, task, "Task created successfully");
        } catch (err) {
            next(err);
        }
    }

    static async update(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user!._id.toString();
            const isAdmin = req.user!.role === UserRole.ADMIN;
            const taskId = req.params.id as string;
            const task = await TaskService.update(taskId, userId, isAdmin, req.body);
            ApiResponse.success(res, task, "Task updated successfully");
        } catch (err) {
            next(err);
        }
    }

    static async remove(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user!._id.toString();
            const isAdmin = req.user!.role === UserRole.ADMIN;
            const taskId = req.params.id as string;
            const result = await TaskService.remove(taskId, userId, isAdmin);
            ApiResponse.success(res, result, "Task deleted successfully");
        } catch (err) {
            next(err);
        }
    }
}
