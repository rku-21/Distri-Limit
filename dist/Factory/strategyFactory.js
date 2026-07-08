"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyFactory = void 0;
const SlidingWindowCounterLimiter_1 = require("../strategies/SlidingWindowCounterLimiter");
const SlidingWindowLogLimiter_1 = require("../strategies/SlidingWindowLogLimiter");
const TokenBucketLimiter_1 = require("../strategies/TokenBucketLimiter");
class StrategyFactory {
    static create(options, store) {
        switch (options.strategy) {
            case "token-bucket":
                return new TokenBucketLimiter_1.TokenBucketLimiter(options.capacity, options.refillRatePerSecond, store);
            case "sliding-window-log":
                return new SlidingWindowLogLimiter_1.SlidingWindowLogLimiter(options.capacity, options.windowSizeMs, store);
            case "sliding-window-counter":
                return new SlidingWindowCounterLimiter_1.SlidingWindowCounter(options.capacity, options.windowSizeMs, store);
            default:
                throw new Error("unsupported rate Limiter Strategy");
        }
    }
}
exports.StrategyFactory = StrategyFactory;
