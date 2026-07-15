import { RateLimiterStore } from "./RateLimiterStore";
import { RateLimitResult } from "../Interfaces/rateLimitResult";
export declare class RedisStore implements RateLimiterStore {
    private readonly redis;
    private readonly tokenBucketLua;
    private readonly slidingWindowLogLua;
    private readonly slidingWindowCounterLua;
    private readonly fixedWindowLua;
    private readonly leakyBucketLua;
    constructor(host: string, port: number);
    executeTokenBucket(identifier: string, capacity: number, refillRatePerSecond: number): Promise<RateLimitResult>;
    executeSlidingWindow(identifier: string, maxRequests: number, windowSizeMs: number): Promise<RateLimitResult>;
    executeSlidingWindowCounter(identifier: string, maxRequests: number, windowSizeMs: number): Promise<RateLimitResult>;
    executeFixedWindow(identifier: string, maxRequests: number, windowSizeMs: number): Promise<{
        allowed: boolean;
        retryAfterMs: number;
        limit: number;
        remaining: number;
    }>;
    executeLeakyBucket(identifier: string, capacity: number, leakRatePerSecond: number): Promise<{
        allowed: boolean;
        retryAfterMs: number;
        limit: number;
        remaining: number;
    }>;
    ping(): Promise<string>;
}
