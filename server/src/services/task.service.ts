import Task from "../models/Task";
import ApiError from "../utils/ApiError";
import { CacheService } from "./cache.service";
import {
    CreateTaskInput,
    UpdateTaskInput,
    TaskQueryInput,
} from "../validators/task.validator";

export class TaskService {
    /**
     * Returns paginated tasks.
     * - Regular users: only their own tasks.
     * - Admins: all tasks in the system.
     */
    static async list(userId: string, isAdmin: boolean, query: TaskQueryInput) {
        const { page, limit, status, priority, sortBy, order } = query;

        // Build a unique cache key from the query params
        const cacheKey = CacheService.taskListKey(
            isAdmin ? "admin" : userId,
            JSON.stringify({ page, limit, status, priority, sortBy, order })
        );

        // Attempt cache hit
        const cached = await CacheService.get<any>(cacheKey);
        if (cached) return cached;

        // Build filter
        const filter: Record<string, any> = {};
        if (!isAdmin) filter.user = userId;
        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        const skip = (page - 1) * limit;
        const sortOption: Record<string, 1 | -1> = {
            [sortBy]: order === "asc" ? 1 : -1,
        };

        const [tasks, total] = await Promise.all([
            Task.find(filter)
                .sort(sortOption)
                .skip(skip)
                .limit(limit)
                .populate("user", "name email")
                .lean(),
            Task.countDocuments(filter),
        ]);

        const result = {
            tasks,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };

        // Cache the result for 2 minutes
        await CacheService.set(cacheKey, result, 120);

        return result;
    }

    static async getById(taskId: string, userId: string, isAdmin: boolean) {
        const cacheKey = CacheService.taskDetailKey(taskId);

        const cached = await CacheService.get<any>(cacheKey);
        if (cached) {
            // ownership check on cached data
            if (!isAdmin && cached.user?._id?.toString() !== userId && cached.user?.toString() !== userId) {
                throw ApiError.forbidden("You cannot access this task");
            }
            return cached;
        }

        const task = await Task.findById(taskId)
            .populate("user", "name email")
            .lean();

        if (!task) throw ApiError.notFound("Task not found");

        if (!isAdmin && (task.user as any)?._id?.toString() !== userId) {
            throw ApiError.forbidden("You cannot access this task");
        }

        await CacheService.set(cacheKey, task, 120);
        return task;
    }

    static async create(userId: string, input: CreateTaskInput) {
        const task = await Task.create({ ...input, user: userId });
        const populated = await task.populate("user", "name email");

        // Invalidate cached list for this user
        await CacheService.invalidateAllTasks();

        return populated;
    }

    static async update(
        taskId: string,
        userId: string,
        isAdmin: boolean,
        input: UpdateTaskInput
    ) {
        const task = await Task.findById(taskId);
        if (!task) throw ApiError.notFound("Task not found");

        if (!isAdmin && task.user.toString() !== userId) {
            throw ApiError.forbidden("You cannot update this task");
        }

        task.set(input);
        await task.save();
        const populated = await task.populate("user", "name email");

        // Bust caches
        await CacheService.del(CacheService.taskDetailKey(taskId));
        await CacheService.invalidateAllTasks();

        return populated;
    }

    static async remove(taskId: string, userId: string, isAdmin: boolean) {
        const task = await Task.findById(taskId);
        if (!task) throw ApiError.notFound("Task not found");

        if (!isAdmin && task.user.toString() !== userId) {
            throw ApiError.forbidden("You cannot delete this task");
        }

        await task.deleteOne();

        // Bust caches
        await CacheService.del(CacheService.taskDetailKey(taskId));
        await CacheService.invalidateAllTasks();

        return { id: taskId };
    }
}
