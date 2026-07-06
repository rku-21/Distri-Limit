export interface RateLimiterStrategy {
    isAllowed 
    (identifier: string):
    Promise<{
        allowed:boolean;
        retryAterMs?:Number;
    }>
}