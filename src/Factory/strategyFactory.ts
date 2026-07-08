import { RateLimiterOptions } from "../config/RateLimitOptions";
import { RateLimiterStore } from "../store/RateLimiterStore";
import { RateLimiterStrategy } from "../strategies/RateLimiterStrategy";
import { SlidingWindowCounter } from "../strategies/SlidingWindowCounterLimiter";
import { SlidingWindowLogLimiter } from "../strategies/SlidingWindowLogLimiter";
import { TokenBucketLimiter } from "../strategies/TokenBucketLimiter";

export class StrategyFactory {
    static create ( 
        options : RateLimiterOptions,
        store : RateLimiterStore,
    ) : RateLimiterStrategy {

          switch(options.strategy){
                case "token-bucket" : 
             return new TokenBucketLimiter(
                options.capacity,
                options.refillRatePerSecond,
                store

             )

                 case "sliding-window-log" : 
             
               return new SlidingWindowLogLimiter(
                  options.capacity,
                  options.windowSizeMs,
                  store
                   
               )

                    case "sliding-window-counter" : 
                  
                 return new SlidingWindowCounter(
                     options.capacity,
                     options.windowSizeMs,
                     store
                 )


                 default: 
                  throw new Error("unsupported rate Limiter Strategy");



        }

    }
}