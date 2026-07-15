import { RateLimitResult } from "../Interfaces/rateLimitResult";
import { RateLimiterStore } from "../store/RateLimiterStore";
import { RateLimiterStrategy } from "./RateLimiterStrategy";
export declare class SlidingWindowCounter implements RateLimiterStrategy {
    private readonly maxRequests;
    private readonly windowSizeMs;
    private readonly store;
    constructor(maxRequests: number, windowSizeMs: number, store: RateLimiterStore);
    isAllowed(identifier: string): Promise<RateLimitResult>;
}
