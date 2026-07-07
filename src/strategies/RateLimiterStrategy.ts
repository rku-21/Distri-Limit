export interface RateLimiterStrategy {
    isAllowed 
    (identifier: string):
    Promise<{
        allowed:boolean;
        retryAfterMs?:Number;
    }>
}