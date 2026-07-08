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

const tokenLimiter = new TokenBucketLimiter(
    100000,
    100000,
    store
);

const slidingWindowLogLimiter = new SlidingWindowLogLimiter(
    100000,
    100000,
    store,
)

const slidingWindowCounterLimiter = new SlidingWindowCounter(
    100000,
    100000,
    store,
)

const TOTAL_REQUESTS = Number(process.env.BENCHMARK_REQUESTS ?? 1000);

type BenchmarkRow = {
    algorithm: string;
    timeMs: number;
    latencyMsPerRequest: number;
    throughputRequestsPerSecond: number;
    allowed: number;
};

const calculateBenchmark = async (
    algorithm: string,
    limiter: RateLimiterStrategy,
): Promise<BenchmarkRow> => {
    let allowed = 0;
    const start=Date.now();
    for (let i = 0; i < TOTAL_REQUESTS; i++) {

        const result = await limiter.isAllowed(`${algorithm}:${i}`);

        if (result.allowed) allowed++;

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












