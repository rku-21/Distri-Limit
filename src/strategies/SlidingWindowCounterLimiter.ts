import { RateLimitResult } from "../Interfaces/rateLimitResult";
import { RateLimiterStore } from "../store/RateLimiterStore";
import { RateLimiterStrategy } from "./RateLimiterStrategy";

export  class SlidingWindowCounter implements RateLimiterStrategy{

    constructor(
        private readonly maxRequests : number,
        private readonly windowSizeMs : number,
        private readonly store : RateLimiterStore,
    ) {}

    async isAllowed(identifier: string): Promise<RateLimitResult> {
        return await this.store.executeSlidingWindowCounter(
            identifier,
            this.maxRequests,
            this.windowSizeMs,
        )
    }
}