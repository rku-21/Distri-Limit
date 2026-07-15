import { RateLimiterOptions } from "../config/RateLimitOptions";
import { RateLimiterStore } from "../store/RateLimiterStore";
import { RateLimiterStrategy } from "../strategies/RateLimiterStrategy";
export declare class StrategyFactory {
    static create(options: RateLimiterOptions, store: RateLimiterStore): RateLimiterStrategy;
}
