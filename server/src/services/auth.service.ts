import jwt, { SignOptions } from "jsonwebtoken";
import User, { IUser, UserRole } from "../models/User";
import ApiError from "../utils/ApiError";
import { RegisterInput, LoginInput } from "../validators/auth.validator";

// generates a signed JWT for the given user.
const signToken = (user: IUser): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw ApiError.internal("JWT_SECRET not configured");

    const options: SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any,
    };

    return jwt.sign({ id: user._id, role: user.role }, secret, options);
};

export class AuthService {
    // Registers a new user and returns a JWT.

    static async register(input: RegisterInput) {
        const existing = await User.findOne({ email: input.email });
        if (existing) {
            throw ApiError.conflict("Email already registered");
        }

        const user = await User.create({
            name: input.name,
            email: input.email,
            password: input.password,
            role: UserRole.USER,
        });

        const token = signToken(user);

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        };
    }


    //Authenticates a user by email/password and returns a JWT.

    static async login(input: LoginInput) {
        const user = await User.findOne({ email: input.email }).select("+password");
        if (!user) {
            throw ApiError.unauthorized("Invalid email or password");
        }

        const isMatch = await user.comparePassword(input.password);
        if (!isMatch) {
            throw ApiError.unauthorized("Invalid email or password");
        }

        const token = signToken(user);

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        };
    }

    // Returns the current user's profile (without password).

    static async getProfile(userId: string) {
        const user = await User.findById(userId);
        if (!user) throw ApiError.notFound("User not found");

        return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        };
    }
}
