import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

export const getRedisClient = (): Redis | null => {
    if (redis) return redis;

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        console.warn("Upstash Redis credentials missing – caching disabled");
        return null;
    }

    redis = new Redis({ url, token });
    console.log("Upstash Redis client initialised");
    return redis;
};
