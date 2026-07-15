import { RateLimitResult } from "../Interfaces/rateLimitResult";
import { RateLimiterStore } from "../store/RateLimiterStore";

import { RateLimiterStrategy } from "./RateLimiterStrategy";
export class SlidingWindowLogLimiter implements RateLimiterStrategy {

    constructor(
        private readonly maxRequests : number,
        private readonly windowSizeMs: number,
        private readonly Store : RateLimiterStore
    ){}

    async isAllowed(identifier: string): Promise<RateLimitResult> {
        return await this.Store.executeSlidingWindow(
            identifier,
            this.maxRequests,
            this.windowSizeMs,
        );
    }
}