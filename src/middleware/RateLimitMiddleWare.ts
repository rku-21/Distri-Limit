import { NextFunction,Request,Response } from "express";
import  {RateLimiterStrategy} from "../strategies/RateLimiterStrategy"

export class RateLimitMiddleWare {

    constructor (
        private readonly Limiter:RateLimiterStrategy,
    ){
        this.handle=this.handle.bind(this);
    }

    async handle(
        req:Request,
        res:Response,
        next:NextFunction,
    ): Promise<void> {
        const identifier= req.ip ?? "unknown";
        console.log(identifier);

        const result=await this.Limiter.isAllowed(identifier);
        console.log(result);

        if(!result.allowed){
            res.status(429).json({
                message:"Too many requests",
                retryAfterMs:result.retryAfterMs,
            })
            return;
        }
        next();

    }

}