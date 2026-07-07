import { RateLimitOptions } from "./config/RateLimitOptions";
import { RateLimitMiddleWare } from "./middleware/RateLimitMiddleWare";
import { RedisStore } from "./store/redisStore";
import { TokenBucketLimiter } from "./strategies/TokenBucketLimiter";

export function rateLimit (options : RateLimitOptions){
    const store=new RedisStore(
        options.redis.host,
        options.redis.port,
    );

    const limiter=new TokenBucketLimiter(
        options.capacity,
        options.refillRatePerSecond,
        store,
    )

    const rateLimitMiddleware=new RateLimitMiddleWare(limiter);

    return  rateLimitMiddleware.handle;






}