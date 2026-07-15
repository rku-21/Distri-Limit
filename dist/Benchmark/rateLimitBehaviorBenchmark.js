"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../config/env");
const redisStore_1 = require("../store/redisStore");
const TokenBucketLimiter_1 = require("../strategies/TokenBucketLimiter");
const SlidingWindowLogLimiter_1 = require("../strategies/SlidingWindowLogLimiter");
const SlidingWindowCounterLimiter_1 = require("../strategies/SlidingWindowCounterLimiter");
const store = new redisStore_1.RedisStore(env_1.env.REDIS_HOST, env_1.env.REDIS_PORT);
const REQUESTS = Number(process.env.BEHAVIOR_BENCHMARK_REQUESTS ?? 1000);
const calculateBehaviorBenchmark = async (algorithm, limiter) => {
    let allowed = 0;
    const start = Date.now();
    for (let i = 0; i < REQUESTS; i++) {
        const result = await limiter.isAllowed("behavior-benchmark");
        if (result.allowed) {
            allowed++;
        }
    }
    const totalTimeMs = Date.now() - start;
    return {
        algorithm,
        requests: REQUESTS,
        allowed,
        rejected: REQUESTS - allowed,
        totalTimeMs,
    };
};
const run = async () => {
    const tokenBucket = new TokenBucketLimiter_1.TokenBucketLimiter(100, 0, store);
    const slidingWindowLog = new SlidingWindowLogLimiter_1.SlidingWindowLogLimiter(100, 10000, store);
    const slidingWindowCounter = new SlidingWindowCounterLimiter_1.SlidingWindowCounter(100, 10000, store);
    const results = [
        await calculateBehaviorBenchmark("token-bucket", tokenBucket),
        await calculateBehaviorBenchmark("sliding-window-log", slidingWindowLog),
        await calculateBehaviorBenchmark("sliding-window-counter", slidingWindowCounter),
    ];
    console.table(results);
};
run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
