import { RateLimiterStore } from "../store/RateLimiterStore";
import { RedisStore } from "../store/redisStore";
import { RateLimiterStrategy } from "./RateLimiterStrategy";
import { RateLimitResult } from "../Interfaces/rateLimitResult";

export class FixedWindowLimiter implements RateLimiterStrategy{
    constructor (
        private readonly maxRequests: number,
        private readonly windowSizeMs: number,
        private readonly store : RateLimiterStore,
    ){}

     async isAllowed(identifier: string): Promise<RateLimitResult> {
       return this.store.executeFixedWindow(
         identifier,
         this.maxRequests,
         this.windowSizeMs,
       )
        
    }

    


}