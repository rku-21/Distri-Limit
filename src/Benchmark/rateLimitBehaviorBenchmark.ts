import { env } from "../config/env";
import { RedisStore } from "../store/redisStore";
import { TokenBucketLimiter } from "../strategies/TokenBucketLimiter";
import { SlidingWindowLogLimiter } from "../strategies/SlidingWindowLogLimiter";
import { SlidingWindowCounter } from "../strategies/SlidingWindowCounterLimiter";
import { RateLimiterStrategy } from "../strategies/RateLimiterStrategy";

const store = new RedisStore(
    env.REDIS_HOST!,
    env.REDIS_PORT,
);

const REQUESTS = Number(process.env.BEHAVIOR_BENCHMARK_REQUESTS ?? 1000);

type BehaviorBenchmarkRow = {
    algorithm: string;
    requests: number;
    allowed: number;
    rejected: number;
    totalTimeMs: number;
};

const calculateBehaviorBenchmark = async (
    algorithm: string,
    limiter: RateLimiterStrategy,
): Promise<BehaviorBenchmarkRow> => {
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
    const tokenBucket = new TokenBucketLimiter(100, 0, store);
    const slidingWindowLog = new SlidingWindowLogLimiter(100, 10_000, store);
    const slidingWindowCounter = new SlidingWindowCounter(100, 10_000, store);

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