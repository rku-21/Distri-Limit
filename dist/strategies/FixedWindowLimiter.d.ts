import { RateLimiterStore } from "../store/RateLimiterStore";
import { RateLimiterStrategy } from "./RateLimiterStrategy";
import { RateLimitResult } from "../Interfaces/rateLimitResult";
export declare class FixedWindowLimiter implements RateLimiterStrategy {
    private readonly maxRequests;
    private readonly windowSizeMs;
    private readonly store;
    constructor(maxRequests: number, windowSizeMs: number, store: RateLimiterStore);
    isAllowed(identifier: string): Promise<RateLimitResult>;
}
