import { NextFunction, Request, Response } from "express";
import { RateLimiterStrategy } from "../strategies/RateLimiterStrategy";
export declare class RateLimitMiddleWare {
    private readonly Limiter;
    constructor(Limiter: RateLimiterStrategy);
    handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}
