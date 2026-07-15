
import { RateLimiterOptions } from "./config/RateLimitOptions";
import { StrategyFactory } from "./Factory/strategyFactory";
import { RateLimitMiddleWare } from "./middleware/RateLimitMiddleWare";
import { RedisStore } from "./store/redisStore";
import { MemoryStore } from "./store/MemoryStore";
import { TokenBucketLimiter } from "./strategies/TokenBucketLimiter";

export function rateLimit (options : RateLimiterOptions){
       
    const store=options.store ?? new MemoryStore();
    
    const strategy=StrategyFactory.create(options,store);

    const rateLimitMiddleware=new RateLimitMiddleWare(
        strategy,
        options.keyGenerator,
        options.handler,
    )

    
    return  rateLimitMiddleware.handle;






}