import { RateLimiterStore } from "./RateLimiterStore";
import { Bucket } from "../models/Bucket";
export declare class RedisStore implements RateLimiterStore {
    private readonly redis;
    private readonly tokenBucketLua;
    private readonly slidingWindowLogLua;
    private readonly slidingWindowCounterLua;
    constructor(host: string, port: number);
    private getTokenBucketKey;
    getBucket(identifier: string): Promise<Bucket | null>;
    saveBucket(identifier: string, bucket: Bucket): Promise<void>;
    deleteBucket(identifier: string): Promise<void>;
    executeTokenBucket(identifier: string, capacity: number, refillRatePerSecond: number): Promise<{
        allowed: boolean;
        retryAfterMs?: number;
    }>;
    private getSlidingWindowLogKey;
    executeSlidingWindow(identifier: string, maxRequests: number, windowSizeMs: number): Promise<{
        allowed: boolean;
        retryAfterMs?: number;
    }>;
    private getslidingWindowCounterKey;
    executeSlidingWindowCounter(identifier: string, maxRequests: number, windowSizeMs: number): Promise<{
        allowed: boolean;
        retryAfterMs?: number;
    }>;
    ping(): Promise<string>;
}
