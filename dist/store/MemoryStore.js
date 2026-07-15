"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryStore = void 0;
const getKey_1 = require("../helperFunctons/getKey");
class MemoryStore {
    constructor() {
        this.store = new Map();
        this.cleanupInterval = setInterval(() => {
            this.cleanupExpiredBuckets();
        }, 60000);
        if (typeof this.cleanupInterval.unref === "function") {
            this.cleanupInterval.unref();
        }
    }
    getBucket(key) {
        const bucket = this.store.get(key);
        if (!bucket) {
            return undefined;
        }
        if (bucket.expireAt <= Date.now()) {
            this.store.delete(key);
            return undefined;
        }
        return bucket;
    }
    setBucket(key, bucket, expireAt) {
        this.store.set(key, {
            ...bucket,
            expireAt,
        });
    }
    cleanupExpiredBuckets() {
        const currentTime = Date.now();
        for (const [key, bucket] of this.store.entries()) {
            if (bucket.expireAt <= currentTime) {
                this.store.delete(key);
            }
        }
    }
    getFixedWindowExpiry(windowSizeMs, currentTime) {
        return currentTime + windowSizeMs * 2;
    }
    getSlidingWindowExpiry(windowSizeMs, currentTime) {
        return currentTime + windowSizeMs * 2;
    }
    getTokenBucketExpiry(capacity, refillRatePerSecond, currentTime) {
        if (refillRatePerSecond <= 0) {
            return currentTime + 60000;
        }
        const refillDurationMs = Math.ceil((capacity / refillRatePerSecond) * 1000);
        return currentTime + Math.max(60000, refillDurationMs * 2);
    }
    getLeakyBucketExpiry(capacity, leakRatePerSecond, currentTime) {
        if (leakRatePerSecond <= 0) {
            return currentTime + 60000;
        }
        const drainDurationMs = Math.ceil((capacity / leakRatePerSecond) * 1000);
        return currentTime + Math.max(60000, drainDurationMs * 2);
    }
    async executeFixedWindow(identifier, maxRequests, windowSizeMs) {
        const key = (0, getKey_1.getKey)(identifier, "fixed-window");
        let currentTime = Date.now();
        let bucket = this.getBucket(key);
        if (!bucket) {
            bucket = {
                requests: 0,
                windowStart: currentTime,
                expireAt: this.getFixedWindowExpiry(windowSizeMs, currentTime),
            };
        }
        let requestsProcessed = bucket.requests;
        let lastWindowStart = bucket.windowStart;
        if (currentTime - lastWindowStart >= windowSizeMs) {
            requestsProcessed = 0;
            lastWindowStart = currentTime;
        }
        let result;
        if (requestsProcessed < maxRequests) {
            result = {
                allowed: true,
                retryAfterMs: 0,
                limit: maxRequests,
                remaining: maxRequests - requestsProcessed,
            };
            this.setBucket(key, {
                requests: requestsProcessed + 1,
                windowStart: lastWindowStart,
            }, this.getFixedWindowExpiry(windowSizeMs, currentTime));
        }
        else {
            result = {
                allowed: false,
                retryAfterMs: windowSizeMs - (currentTime - lastWindowStart),
                limit: maxRequests,
                remaining: 0,
            };
            this.setBucket(key, {
                requests: requestsProcessed,
                windowStart: lastWindowStart,
            }, this.getFixedWindowExpiry(windowSizeMs, currentTime));
        }
        return result;
    }
    async executeTokenBucket(identifier, capacity, refillRatePerSecond) {
        const key = (0, getKey_1.getKey)(identifier, "token-bucket");
        let currentTime = Date.now();
        let bucket = this.getBucket(key);
        if (!bucket) {
            bucket = {
                tokens: capacity,
                lastRefill: currentTime,
                expireAt: this.getTokenBucketExpiry(capacity, refillRatePerSecond, currentTime),
            };
        }
        let tokensLeft = bucket.tokens;
        let lastRefill = bucket.lastRefill;
        const elapsedTime = currentTime - lastRefill;
        const earnedTokens = elapsedTime * refillRatePerSecond / 1000;
        tokensLeft = Math.min(capacity, tokensLeft + earnedTokens);
        lastRefill = currentTime;
        let result;
        if (tokensLeft >= 1) { // enought tokens to process the request 
            tokensLeft -= 1;
            this.setBucket(key, {
                tokens: tokensLeft,
                lastRefill: lastRefill,
            }, this.getTokenBucketExpiry(capacity, refillRatePerSecond, currentTime));
            result = {
                allowed: true,
                retryAfterMs: 0,
                limit: capacity,
                remaining: tokensLeft,
            };
        }
        else {
            this.setBucket(key, {
                tokens: tokensLeft,
                lastRefill: lastRefill,
            }, this.getTokenBucketExpiry(capacity, refillRatePerSecond, currentTime));
            const requiredTokens = 1 - tokensLeft;
            const retryAfterMs = requiredTokens / refillRatePerSecond * 1000;
            result = {
                allowed: false,
                retryAfterMs: retryAfterMs,
                limit: capacity,
                remaining: 0,
            };
        }
        return result;
    }
    async executeLeakyBucket(identifier, capacity, leakRatePerSecond) {
        const key = (0, getKey_1.getKey)(identifier, "leaky-bucket");
        let currentTime = Date.now();
        let bucket = this.getBucket(key);
        if (!bucket) {
            bucket = {
                water: 0,
                lastLeak: currentTime,
                expireAt: this.getLeakyBucketExpiry(capacity, leakRatePerSecond, currentTime),
            };
        }
        let waterLevel = bucket.water;
        let lastLeakTime = bucket.lastLeak;
        const elapsedTime = currentTime - lastLeakTime;
        const leakedWater = elapsedTime * leakRatePerSecond / 1000;
        lastLeakTime = currentTime;
        waterLevel = Math.max(0, waterLevel - leakedWater);
        // now check that wheater this request can be processed or not 
        let result;
        if (waterLevel + 1 <= capacity) {
            waterLevel += 1;
            this.setBucket(key, {
                water: waterLevel,
                lastLeak: lastLeakTime,
            }, this.getLeakyBucketExpiry(capacity, leakRatePerSecond, currentTime));
            result = {
                allowed: true,
                retryAfterMs: 0,
                limit: capacity,
                remaining: capacity - Math.ceil(waterLevel),
            };
        }
        else {
            this.setBucket(key, {
                water: waterLevel,
                lastLeak: lastLeakTime,
            }, this.getLeakyBucketExpiry(capacity, leakRatePerSecond, currentTime));
            let requiredLeak = 1 - (capacity - waterLevel);
            let retryAfterMs = requiredLeak / leakRatePerSecond * 1000;
            result = {
                allowed: false,
                retryAfterMs: retryAfterMs,
                limit: capacity,
                remaining: 0,
            };
        }
        return result;
    }
    ;
    async executeSlidingWindow(identifier, maxRequests, windowSizeMs) {
        const key = (0, getKey_1.getKey)(identifier, "sliding-window-log");
        const currentTime = Date.now();
        let bucket = this.getBucket(key);
        if (!bucket) {
            bucket = {
                timestamps: [],
                expireAt: this.getSlidingWindowExpiry(windowSizeMs, currentTime),
            };
        }
        //  remove the expire times 
        let filteredBucket = bucket.timestamps.filter((t) => currentTime - t < windowSizeMs);
        let result;
        if (filteredBucket.length < maxRequests) {
            //       let the request  processed 
            filteredBucket.push(currentTime);
            this.setBucket(key, {
                timestamps: filteredBucket,
            }, this.getSlidingWindowExpiry(windowSizeMs, currentTime));
            result = {
                allowed: true,
                retryAfterMs: 0,
                limit: maxRequests,
                remaining: maxRequests - filteredBucket.length
            };
        }
        else {
            // cannot proceed with tihs request 
            this.setBucket(key, {
                timestamps: filteredBucket,
            }, this.getSlidingWindowExpiry(windowSizeMs, currentTime));
            const oldest = filteredBucket[0];
            const retryAfterMs = windowSizeMs - (currentTime - oldest);
            result = {
                allowed: false,
                retryAfterMs: retryAfterMs,
                limit: maxRequests,
                remaining: 0,
            };
        }
        return result;
    }
    async executeSlidingWindowCounter(identifier, maxRequests, windowSizeMs) {
        const key = (0, getKey_1.getKey)(identifier, "sliding-window-counter");
        const currentTime = Date.now();
        let bucket = this.getBucket(key);
        if (!bucket) {
            bucket = {
                currentWindow: 0,
                previouseWindow: 0,
                windowStart: currentTime,
                expireAt: this.getSlidingWindowExpiry(windowSizeMs, currentTime),
            };
        }
        let elapsedTime = currentTime - bucket.windowStart;
        let currentWindowRequestCount = bucket.currentWindow;
        let previousWindowRequestCount = bucket.previouseWindow;
        if (elapsedTime >= 2 * windowSizeMs) {
            previousWindowRequestCount = 0;
            currentWindowRequestCount = 0;
            bucket.windowStart = currentTime;
            elapsedTime = 0;
        }
        else if (elapsedTime >= windowSizeMs) {
            previousWindowRequestCount = currentWindowRequestCount;
            currentWindowRequestCount = 0;
            bucket.windowStart = currentTime;
            elapsedTime = 0;
        }
        let weight = (windowSizeMs - elapsedTime) / windowSizeMs;
        let estimatedCount = currentWindowRequestCount + previousWindowRequestCount * weight;
        let result;
        if (estimatedCount < maxRequests) {
            this.setBucket(key, {
                currentWindow: currentWindowRequestCount + 1,
                previouseWindow: previousWindowRequestCount,
                windowStart: bucket.windowStart,
            }, this.getSlidingWindowExpiry(windowSizeMs, currentTime));
            result = {
                allowed: true,
                retryAfterMs: 0,
                limit: maxRequests,
                remaining: maxRequests - Math.max(0, Math.ceil(maxRequests - estimatedCount)),
            };
        }
        else {
            this.setBucket(key, {
                currentWindow: currentWindowRequestCount,
                previouseWindow: previousWindowRequestCount,
                windowStart: bucket.windowStart,
            }, this.getSlidingWindowExpiry(windowSizeMs, currentTime));
            result = {
                allowed: false,
                retryAfterMs: windowSizeMs - elapsedTime,
                limit: maxRequests,
                remaining: Math.max(0, maxRequests - Math.ceil(estimatedCount))
            };
        }
        return result;
    }
}
exports.MemoryStore = MemoryStore;
