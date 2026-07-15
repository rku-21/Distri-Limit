export interface RateLimitResult {
    allowed: boolean;
    retryAfterMs?: number;
    limit: number;
    remaining: number;
}
