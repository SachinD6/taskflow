import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string({ message: "Name is required" })
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters")
        .trim(),
    email: z
        .string({ message: "Email is required" })
        .email("Invalid email address")
        .toLowerCase()
        .trim(),
    password: z
        .string({ message: "Password is required" })
        .min(6, "Password must be at least 6 characters")
        .max(128, "Password cannot exceed 128 characters"),
});

export const loginSchema = z.object({
    email: z
        .string({ message: "Email is required" })
        .email("Invalid email address")
        .toLowerCase()
        .trim(),
    password: z
        .string({ message: "Password is required" })
        .min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
