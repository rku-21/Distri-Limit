"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisStore = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getKey_1 = require("../helperFunctons/getKey");
class RedisStore {
    constructor(host, port) {
        this.redis = new ioredis_1.default({
            host,
            port,
        });
        this.tokenBucketLua = fs_1.default.readFileSync(path_1.default.join(__dirname, "../scripts/token_bucket.lua"), "utf-8");
        this.slidingWindowLogLua = fs_1.default.readFileSync(path_1.default.join(__dirname, "../scripts/sliding_window_log.lua"), "utf-8");
        this.slidingWindowCounterLua = fs_1.default.readFileSync(path_1.default.join(__dirname, "../scripts/sliding_window_counter.lua"), "utf-8");
        this.fixedWindowLua = fs_1.default.readFileSync(path_1.default.join(__dirname, "../scripts/fixed_window.lua"), "utf-8");
        this.leakyBucketLua = fs_1.default.readFileSync(path_1.default.join(__dirname, "../scripts/leaky_bucket.lua"), "utf-8");
    }
    async executeTokenBucket(identifier, capacity, refillRatePerSecond) {
        const key = (0, getKey_1.getKey)(identifier, "token-bucket");
        const result = await this.redis.eval(this.tokenBucketLua, 1, key, capacity, refillRatePerSecond, Date.now());
        return {
            allowed: result[0] === 1,
            retryAfterMs: result[1],
            limit: result[2],
            remaining: result[3],
        };
    }
    async executeSlidingWindow(identifier, maxRequests, windowSizeMs) {
        const key = (0, getKey_1.getKey)(identifier, "sliding-window-log");
        const result = await this.redis.eval(this.slidingWindowLogLua, 1, key, maxRequests, windowSizeMs, Date.now());
        return {
            allowed: result[0] === 1,
            retryAfterMs: result[1],
            limit: result[2],
            remaining: result[3],
        };
    }
    async executeSlidingWindowCounter(identifier, maxRequests, windowSizeMs) {
        const key = (0, getKey_1.getKey)(identifier, "sliding-window-counter");
        const result = await this.redis.eval(this.slidingWindowCounterLua, 1, key, maxRequests, windowSizeMs, Date.now());
        return {
            allowed: result[0] === 1,
            retryAfterMs: result[1],
            limit: result[2],
            remaining: result[3],
        };
    }
    async executeFixedWindow(identifier, maxRequests, windowSizeMs) {
        const key = (0, getKey_1.getKey)(identifier, "fixed-window");
        const result = await this.redis.eval(this.fixedWindowLua, 1, key, maxRequests, windowSizeMs, Date.now());
        return {
            allowed: result[0] === 1,
            retryAfterMs: result[1],
            limit: result[2],
            remaining: result[3],
        };
    }
    async executeLeakyBucket(identifier, capacity, leakRatePerSecond) {
        const key = (0, getKey_1.getKey)(identifier, "leaky-bucket");
        const result = await this.redis.eval(this.leakyBucketLua, 1, key, capacity, leakRatePerSecond, Date.now());
        return {
            allowed: result[0] == 1,
            retryAfterMs: result[1],
            limit: result[2],
            remaining: result[3]
        };
    }
    async ping() {
        return await this.redis.ping();
    }
}
exports.RedisStore = RedisStore;
