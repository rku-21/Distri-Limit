import { NextFunction, Request, Response } from "express";
import { RateLimiterStrategy } from "../strategies/RateLimiterStrategy";
import { keyGenerator } from "../types/keyGenerator";
import { handler } from "../types/customHandler";
export declare class RateLimitMiddleWare {
    private readonly Limiter;
    private readonly keyGenerator?;
    private readonly handler?;
    constructor(Limiter: RateLimiterStrategy, keyGenerator?: keyGenerator | undefined, handler?: handler | undefined);
    handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}
