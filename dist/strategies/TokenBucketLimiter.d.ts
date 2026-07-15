import { RateLimiterStore } from "../store/RateLimiterStore";
import { RateLimiterStrategy } from "./RateLimiterStrategy";
import { RateLimitResult } from "../Interfaces/rateLimitResult";
export declare class TokenBucketLimiter implements RateLimiterStrategy {
    private readonly capacity;
    private readonly refillRatePerSecond;
    private readonly store;
    constructor(capacity: number, refillRatePerSecond: number, store: RateLimiterStore);
    isAllowed(identifier: string): Promise<RateLimitResult>;
}
