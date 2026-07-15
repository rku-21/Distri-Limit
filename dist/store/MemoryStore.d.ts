import { RateLimitResult } from "../Interfaces/rateLimitResult";
import { RateLimiterStore } from "./RateLimiterStore";
export declare class MemoryStore implements RateLimiterStore {
    private readonly store;
    private readonly cleanupInterval;
    constructor();
    private getBucket;
    private setBucket;
    private cleanupExpiredBuckets;
    private getFixedWindowExpiry;
    private getSlidingWindowExpiry;
    private getTokenBucketExpiry;
    private getLeakyBucketExpiry;
    executeFixedWindow(identifier: string, maxRequests: number, windowSizeMs: number): Promise<RateLimitResult>;
    executeTokenBucket(identifier: string, capacity: number, refillRatePerSecond: number): Promise<RateLimitResult>;
    executeLeakyBucket(identifier: string, capacity: number, leakRatePerSecond: number): Promise<RateLimitResult>;
    executeSlidingWindow(identifier: string, maxRequests: number, windowSizeMs: number): Promise<RateLimitResult>;
    executeSlidingWindowCounter(identifier: string, maxRequests: number, windowSizeMs: number): Promise<RateLimitResult>;
}
