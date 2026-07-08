
import { RateLimiterOptions } from "./config/RateLimitOptions";
import { StrategyFactory } from "./Factory/strategyFactory";
import { RateLimitMiddleWare } from "./middleware/RateLimitMiddleWare";
import { RedisStore } from "./store/redisStore";
import { TokenBucketLimiter } from "./strategies/TokenBucketLimiter";

export function rateLimit (options : RateLimiterOptions){
    const store=new RedisStore(
        options.redis.host,
        options.redis.port,
    );

    const strategy=StrategyFactory.create(options,store);

    const rateLimitMiddleware=new RateLimitMiddleWare(strategy)

    
    return  rateLimitMiddleware.handle;






}