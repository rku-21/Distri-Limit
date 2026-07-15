import { RateLimiterStore } from "../store/RateLimiterStore";
import { RateLimiterStrategy } from "./RateLimiterStrategy";
import { RateLimitResult } from "../Interfaces/rateLimitResult";
export declare class LeakyBucketLimiter implements RateLimiterStrategy {
    private readonly capacity;
    private readonly leakRatePerSecond;
    private readonly store;
    constructor(capacity: number, leakRatePerSecond: number, store: RateLimiterStore);
    isAllowed(identifier: string): Promise<RateLimitResult>;
}
