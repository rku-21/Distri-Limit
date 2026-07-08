import { RateLimitOptions } from "./RateLimitOptions";
export interface TokenBucketOptions extends RateLimitOptions {
    strategy: "token-bucket";
    capacity: number;
    refillRatePerSecond: number;
}
