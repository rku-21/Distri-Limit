import { SlidingWindowCounterOptions } from "./SlidingWindowCounterOptions"
import { SlidingWindowLogOptions } from "./SlidingWindowLogOptions"
import { TokenBucketOptions } from "./TokenBucketOptions"

export interface RateLimitOptions {
    redis : {
        host: string,
        port :number,
    }
}

export type RateLimiterOptions =
        SlidingWindowCounterOptions | 
        SlidingWindowLogOptions | 
        TokenBucketOptions 