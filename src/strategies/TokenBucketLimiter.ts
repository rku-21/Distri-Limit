import {RateLimiterStrategy} from "./RateLimiterStrategy";

export  class TokenBucketLimiter implements RateLimiterStrategy {

    private readonly capacity : number;
    private readonly refillRatePerSecond : number;

    constructor (capacity:number, refillRate: number){
         this.capacity=capacity;
         this.refillRatePerSecond=refillRate;
    }

     async isAllowed(identifier: string): 
     Promise<{ 
        allowed: boolean; 
        retryAterMs?: Number; 
    }> {
        
        return {
            allowed:true
        }
    }



}
