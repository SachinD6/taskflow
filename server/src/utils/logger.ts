import morgan from "morgan";

/**
 * Configured Morgan HTTP request logger.
 * Uses 'dev' format in development, 'combined' in production.
 */
const httpLogger = morgan(
    process.env.NODE_ENV === "production" ? "combined" : "dev"
);

export default httpLogger;
