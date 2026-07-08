"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../config/env");
const redisStore_1 = require("../store/redisStore");
const TokenBucketLimiter_1 = require("../strategies/TokenBucketLimiter");
const SlidingWindowLogLimiter_1 = require("../strategies/SlidingWindowLogLimiter");
const SlidingWindowCounterLimiter_1 = require("../strategies/SlidingWindowCounterLimiter");
const store = new redisStore_1.RedisStore(env_1.env.REDIS_HOST, env_1.env.REDIS_PORT);
const tokenLimiter = new TokenBucketLimiter_1.TokenBucketLimiter(100000, 100000, store);
const slidingWindowLogLimiter = new SlidingWindowLogLimiter_1.SlidingWindowLogLimiter(100000, 100000, store);
const slidingWindowCounterLimiter = new SlidingWindowCounterLimiter_1.SlidingWindowCounter(100000, 100000, store);
const TOTAL_REQUESTS = Number(process.env.BENCHMARK_REQUESTS ?? 1000);
const calculateBenchmark = async (algorithm, limiter) => {
    let allowed = 0;
    const start = Date.now();
    for (let i = 0; i < TOTAL_REQUESTS; i++) {
        const result = await limiter.isAllowed(`${algorithm}:${i}`);
        if (result.allowed)
            allowed++;
    }
    const end = Date.now();
    const totalTime = end - start;
    const latency = totalTime / TOTAL_REQUESTS;
    const throughput = TOTAL_REQUESTS / (totalTime / 1000);
    return {
        algorithm,
        timeMs: totalTime,
        latencyMsPerRequest: latency,
        throughputRequestsPerSecond: throughput,
        allowed,
    };
};
const run = async () => {
    const results = [
        await calculateBenchmark("token-bucket", tokenLimiter),
        await calculateBenchmark("sliding-window-counter", slidingWindowCounterLimiter),
        await calculateBenchmark("sliding-window-log", slidingWindowLogLimiter),
    ];
    console.table(results);
};
run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
