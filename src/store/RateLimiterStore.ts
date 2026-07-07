import { Bucket } from "../models/Bucket"

export interface RateLimiterStore {
    executeTokenBucket(
        identifier : string,
        capacity : number,
        refillRatePerSecond : number,
    ): Promise<{
        allowed :boolean,
        retryAfterMs? : number,
    }>
    getBucket(identifier:string) : Promise<Bucket | null>;
    saveBucket(identifier:string,bucket:Bucket) : Promise<void>;
    deleteBucket(identifier:string) : Promise<void>;
    


}