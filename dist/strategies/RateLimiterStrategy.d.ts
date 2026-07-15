import { RateLimitResult } from "../Interfaces/rateLimitResult";
export interface RateLimiterStrategy {
    isAllowed(identifier: string): Promise<RateLimitResult>;
}
