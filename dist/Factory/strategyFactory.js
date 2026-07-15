"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyFactory = void 0;
const FixedWindowLimiter_1 = require("../strategies/FixedWindowLimiter");
const LeakyBucketLimiter_1 = require("../strategies/LeakyBucketLimiter");
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
            case "fixed-winodw":
                return new FixedWindowLimiter_1.FixedWindowLimiter(options.capacity, options.windowSizeMs, store);
            case "leaky-bucket":
                return new LeakyBucketLimiter_1.LeakyBucketLimiter(options.capacity, options.leakRatePerSecond, store);
            default:
                throw new Error("unsupported rate Limiter Strategy");
        }
    }
}
exports.StrategyFactory = StrategyFactory;
