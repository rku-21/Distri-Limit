import Redis from "ioredis";
import fs from "fs";
import path from "path";
import { RateLimiterStore } from "./RateLimiterStore";
import {env} from "../config/env"

import { Bucket } from "../models/Bucket";

export class RedisStore implements RateLimiterStore {

    private readonly redis : Redis;
    private readonly tokenBucketLua : string;

    constructor(host : string ,port :number){
        this.redis=new Redis({
            host,
            port,
        })
    

         this.tokenBucketLua=fs.readFileSync(
            path.join(__dirname,"../scripts/token_bucket.lua"),
            "utf-8",
         )
    } 

    private getKey(identifier: string): string {
        return `rate_limit:${identifier}`;
    }

    async getBucket (identifier:string): Promise<Bucket | null> {
        const key=this.getKey(identifier);

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
        const key=this.getKey(identifier);

        await this.redis.hset(
            key,
            "tokens", bucket.tokens,
            "lastrefill", bucket.lastRefill,
        );
    }

    async deleteBucket(identifier: string ): Promise<void> {
        const key=this.getKey(identifier);

        await this.redis.del(key);
    }
    
    async executeTokenBucket(identifier: string, capacity: number, refillRatePerSecond: number): 
    Promise<{ allowed: boolean; retryAfterMs?: number; }> {

        const key=this.getKey(identifier);

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

    async ping():Promise<string> {
        return await this.redis.ping();
    }

}