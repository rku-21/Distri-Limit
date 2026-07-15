import { RateLimiterStore } from "../store/RateLimiterStore";
import { RateLimiterStrategy } from "./RateLimiterStrategy";
import { RateLimitResult } from "../Interfaces/rateLimitResult";

export class LeakyBucketLimiter implements RateLimiterStrategy {

    constructor(
        private readonly capacity:number,
        private readonly leakRatePerSecond: number,
        private readonly store: RateLimiterStore
    ) {}

    async isAllowed(identifier: string): Promise<RateLimitResult> {

       return this.store.executeLeakyBucket(
         identifier,
         this.capacity,
         this.leakRatePerSecond,
       )
        
    }



}