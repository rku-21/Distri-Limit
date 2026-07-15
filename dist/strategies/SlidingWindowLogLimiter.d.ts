import { RateLimitResult } from "../Interfaces/rateLimitResult";
import { RateLimiterStore } from "../store/RateLimiterStore";
import { RateLimiterStrategy } from "./RateLimiterStrategy";
export declare class SlidingWindowLogLimiter implements RateLimiterStrategy {
    private readonly maxRequests;
    private readonly windowSizeMs;
    private readonly Store;
    constructor(maxRequests: number, windowSizeMs: number, Store: RateLimiterStore);
    isAllowed(identifier: string): Promise<RateLimitResult>;
}
