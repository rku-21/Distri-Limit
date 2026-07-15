"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitMiddleWare = void 0;
class RateLimitMiddleWare {
    constructor(Limiter, keyGenerator, handler) {
        this.Limiter = Limiter;
        this.keyGenerator = keyGenerator;
        this.handler = handler;
        this.handle = this.handle.bind(this);
    }
    async handle(req, res, next) {
        const identifier = this.keyGenerator?.(req) ?? req.ip;
        const result = await this.Limiter.isAllowed(identifier);
        res.setHeader("RateLimit-Limit", String(result.limit));
        res.setHeader("RateLimit-Remaining", String(result.remaining));
        if (result.retryAfterMs !== undefined) {
            res.setHeader("Retry-After", String(Math.ceil(result.retryAfterMs)));
            res.setHeader("RateLimit-Reset", String(Date.now() + result.retryAfterMs));
        }
        res.setHeader("Access-Control-Expose-Headers", "RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset, Retry-After");
        if (!result.allowed) {
            if (this.handler) {
                return this.handler(req, res, result);
            }
            res.status(429).json({
                message: "Too many requests",
                retryAfterMs: result.retryAfterMs,
                limit: result.limit,
                remaining: result.remaining,
            });
            return;
        }
        next();
    }
}
exports.RateLimitMiddleWare = RateLimitMiddleWare;
