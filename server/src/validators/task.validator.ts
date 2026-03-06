import { z } from "zod";
import { TaskStatus, TaskPriority } from "../models/Task";

export const createTaskSchema = z.object({
    title: z
        .string({ message: "Title is required" })
        .min(1, "Title cannot be empty")
        .max(120, "Title cannot exceed 120 characters")
        .trim(),
    description: z
        .string()
        .max(1000, "Description cannot exceed 1000 characters")
        .trim()
        .optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    dueDate: z
        .string()
        .datetime({ message: "Invalid date format – use ISO 8601" })
        .optional(),
});

export const updateTaskSchema = z.object({
    title: z
        .string()
        .min(1, "Title cannot be empty")
        .max(120, "Title cannot exceed 120 characters")
        .trim()
        .optional(),
    description: z
        .string()
        .max(1000, "Description cannot exceed 1000 characters")
        .trim()
        .optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    dueDate: z
        .string()
        .datetime({ message: "Invalid date format – use ISO 8601" })
        .optional()
        .nullable(),
});

export const taskQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    sortBy: z.enum(["createdAt", "dueDate", "priority", "status"]).default("createdAt"),
    order: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
