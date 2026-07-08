"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitMiddleWare = void 0;
class RateLimitMiddleWare {
    constructor(Limiter) {
        this.Limiter = Limiter;
        this.handle = this.handle.bind(this);
    }
    async handle(req, res, next) {
        const identifier = req.ip ?? "unknown";
        console.log(identifier);
        const result = await this.Limiter.isAllowed(identifier);
        console.log(result);
        if (!result.allowed) {
            res.status(429).json({
                message: "Too many requests",
                retryAfterMs: result.retryAfterMs,
            });
            return;
        }
        next();
    }
}
exports.RateLimitMiddleWare = RateLimitMiddleWare;
