import { RateLimitResult } from "../Interfaces/rateLimitResult";
export interface RateLimiterStore {
    executeTokenBucket(identifier: string, capacity: number, refillRatePerSecond: number): Promise<RateLimitResult>;
    executeSlidingWindow(identifier: string, maxRequests: number, windowSizeMs: number): Promise<RateLimitResult>;
    executeSlidingWindowCounter(identifier: string, maxRequests: number, windowSizeMs: number): Promise<RateLimitResult>;
    executeFixedWindow(identifier: string, maxRequests: number, windowSizeMs: number): Promise<RateLimitResult>;
    executeLeakyBucket(identifier: string, capacity: number, leakRatePerSecond: number): Promise<RateLimitResult>;
}
