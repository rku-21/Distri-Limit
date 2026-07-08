import Redis from "ioredis";
import fs from "fs";
import path from "path";
import { RateLimiterStore } from "./RateLimiterStore";
import {env} from "../config/env"

import { Bucket } from "../models/Bucket";

export class RedisStore implements RateLimiterStore {

    private readonly redis : Redis;
    private readonly tokenBucketLua : string;
    private readonly slidingWindowLogLua : string;
    private readonly slidingWindowCounterLua : string;

    constructor(host : string ,port :number){
        this.redis=new Redis({
            host,
            port,
        })
    

         this.tokenBucketLua=fs.readFileSync(
            path.join(__dirname,"../scripts/token_bucket.lua"),
            "utf-8",
         )
         this.slidingWindowLogLua=fs.readFileSync(
            path.join(__dirname, "../scripts/sliding_window_log.lua"),
            "utf-8",
         )
         this.slidingWindowCounterLua=fs.readFileSync(
            path.join(__dirname,"../scripts/sliding_window_counter.lua"),
            "utf-8",
         )
    } 

    private getTokenBucketKey(identifier: string): string {
        return `rate_limit:${identifier}`;
    }

    async getBucket (identifier:string): Promise<Bucket | null> {
        const key=this.getTokenBucketKey(identifier);

        const result =await this.redis.hmget(
            key,
            "tokens",
            "lastrefill",
        );

        if(result[0]==null || result[1]==null) return null;

        return {
        tokens: Number(result[0]),
        lastRefill: Number(result[1])
      };

    }

    async saveBucket(identifier: string, bucket: Bucket) : Promise<void> {
        const key=this.getTokenBucketKey(identifier);

        await this.redis.hset(
            key,
            "tokens", bucket.tokens,
            "lastrefill", bucket.lastRefill,
        );
    }

    async deleteBucket(identifier: string ): Promise<void> {
        const key=this.getTokenBucketKey(identifier);

        await this.redis.del(key);
    }
    
    async executeTokenBucket(identifier: string, capacity: number, refillRatePerSecond: number): 
    Promise<{ allowed: boolean; retryAfterMs?: number; }> {

        const key=this.getTokenBucketKey(identifier);

        const result=await this.redis.eval(
            this.tokenBucketLua,
            1,
            key,
            capacity,
            refillRatePerSecond,
            Date.now(),
        ) as number[];

        return {
            allowed : result[0]===1,
            retryAfterMs : result[1],
        };
        

    }


    private getSlidingWindowLogKey(identifier:string){
        return `sliding_window_log:${identifier}`
    }


    async executeSlidingWindow(identifier: string, maxRequests: number, windowSizeMs: number):
     Promise<{ allowed: boolean; retryAfterMs?: number; }> {

        const key=this.getSlidingWindowLogKey(identifier);

        const result= await this.redis.eval(
            this.slidingWindowLogLua,
            1,
            key,
            maxRequests,
            windowSizeMs,
            Date.now(),

        ) as number[];

        return {
            allowed: result[0]===1,
            retryAfterMs : result[1],

        }
    }





    private getslidingWindowCounterKey(identifier :string ){
        return `sliding_windoww_counter_key${identifier}`;

    }


    async executeSlidingWindowCounter(identifier: string, maxRequests: number, windowSizeMs: number):
     Promise<{ allowed: boolean; retryAfterMs?: number; }> {

        const key=this.getslidingWindowCounterKey(identifier);

        const result=await this.redis.eval(
            this.slidingWindowCounterLua,
            1,
            key,
            maxRequests,
            windowSizeMs,
            Date.now()
        ) as number[]

        return {
            allowed: result[0]===1,
            retryAfterMs: result[1],
        }

        
    }

    async ping():Promise<string> {
        return await this.redis.ping();
    }

}