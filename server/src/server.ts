import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/db";
import { getRedisClient } from "./config/redis";

const PORT = process.env.PORT || 5000;

const bootstrap = async () => {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Initialise Redis (optional)
    getRedisClient();

    // 3. Start HTTP server
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`API docs available at http://localhost:${PORT}/api-docs`);
    });
};

bootstrap().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
