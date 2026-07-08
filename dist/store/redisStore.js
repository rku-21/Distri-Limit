"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisStore = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class RedisStore {
    constructor(host, port) {
        this.redis = new ioredis_1.default({
            host,
            port,
        });
        this.tokenBucketLua = fs_1.default.readFileSync(path_1.default.join(__dirname, "../scripts/token_bucket.lua"), "utf-8");
        this.slidingWindowLogLua = fs_1.default.readFileSync(path_1.default.join(__dirname, "../scripts/sliding_window_log.lua"), "utf-8");
        this.slidingWindowCounterLua = fs_1.default.readFileSync(path_1.default.join(__dirname, "../scripts/sliding_window_counter.lua"), "utf-8");
    }
    getTokenBucketKey(identifier) {
        return `rate_limit:${identifier}`;
    }
    async getBucket(identifier) {
        const key = this.getTokenBucketKey(identifier);
        const result = await this.redis.hmget(key, "tokens", "lastrefill");
        if (result[0] == null || result[1] == null)
            return null;
        return {
            tokens: Number(result[0]),
            lastRefill: Number(result[1])
        };
    }
    async saveBucket(identifier, bucket) {
        const key = this.getTokenBucketKey(identifier);
        await this.redis.hset(key, "tokens", bucket.tokens, "lastrefill", bucket.lastRefill);
    }
    async deleteBucket(identifier) {
        const key = this.getTokenBucketKey(identifier);
        await this.redis.del(key);
    }
    async executeTokenBucket(identifier, capacity, refillRatePerSecond) {
        const key = this.getTokenBucketKey(identifier);
        const result = await this.redis.eval(this.tokenBucketLua, 1, key, capacity, refillRatePerSecond, Date.now());
        return {
            allowed: result[0] === 1,
            retryAfterMs: result[1],
        };
    }
    getSlidingWindowLogKey(identifier) {
        return `sliding_window_log:${identifier}`;
    }
    async executeSlidingWindow(identifier, maxRequests, windowSizeMs) {
        const key = this.getSlidingWindowLogKey(identifier);
        const result = await this.redis.eval(this.slidingWindowLogLua, 1, key, maxRequests, windowSizeMs, Date.now());
        return {
            allowed: result[0] === 1,
            retryAfterMs: result[1],
        };
    }
    getslidingWindowCounterKey(identifier) {
        return `sliding_windoww_counter_key${identifier}`;
    }
    async executeSlidingWindowCounter(identifier, maxRequests, windowSizeMs) {
        const key = this.getslidingWindowCounterKey(identifier);
        const result = await this.redis.eval(this.slidingWindowCounterLua, 1, key, maxRequests, windowSizeMs, Date.now());
        return {
            allowed: result[0] === 1,
            retryAfterMs: result[1],
        };
    }
    async ping() {
        return await this.redis.ping();
    }
}
exports.RedisStore = RedisStore;
