import { getRedisClient } from "../config/redis";

const DEFAULT_TTL = 120; // 2 minutes

export class CacheService {
    // Attempts to retrieve a value from cache.
    // Returns null on miss or if Redis is unavailable.
    static async get<T>(key: string): Promise<T | null> {
        try {
            const client = getRedisClient();
            if (!client) return null;

            const data = await client.get<T>(key);
            return data ?? null;
        } catch (err) {
            console.warn("Cache GET error:", err);
            return null;
        }
    }

    //   Stores a value in cache with a TTL (seconds).
    //  Do NOT pre-stringify – the Upstash client serialises for us.

    static async set(key: string, value: unknown, ttl = DEFAULT_TTL): Promise<void> {
        try {
            const client = getRedisClient();
            if (!client) return;

            await client.set(key, value, { ex: ttl });
        } catch (err) {
            console.warn("Cache SET error:", err);
        }
    }

    //    Deletes one or more cache keys.
    static async del(...keys: string[]): Promise<void> {
        try {
            const client = getRedisClient();
            if (!client || keys.length === 0) return;

            await client.del(...keys);
        } catch (err) {
            console.warn("Cache DEL error:", err);
        }
    }

    /*
      Invalidates all keys matching a given prefix pattern.
      Used to bust list caches when any task is created, updated or deleted.
     */
    static async invalidatePattern(pattern: string): Promise<void> {
        try {
            const client = getRedisClient();
            if (!client) return;

            const keys = await client.keys(pattern);
            if (keys.length > 0) {
                await client.del(...keys);
                console.log(`Cache: invalidated ${keys.length} key(s) matching ${pattern}`);
            }
        } catch (err) {
            console.warn("Cache INVALIDATE error:", err);
        }
    }

    /*
     Flush ALL task-related caches 
      Guarantees freshness at the cost of one extra DB hit on the next read.
     */
    static async invalidateAllTasks(): Promise<void> {
        await CacheService.invalidatePattern("tasks:*");
    }

    // helper functiosn.
    static taskListKey(userId: string, query: string): string {
        return `tasks:list:${userId}:${query}`;
    }

    static taskDetailKey(taskId: string): string {
        return `tasks:detail:${taskId}`;
    }

    static userTasksPattern(userId: string): string {
        return `tasks:list:${userId}:*`;
    }
}
