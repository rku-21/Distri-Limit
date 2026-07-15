import { RateLimitOptions } from "./RateLimitOptions";

export interface LeakyBucketOptions extends RateLimitOptions{
    strategy:"leaky-bucket",
    capacity:number,
    leakRatePerSecond:number
}