"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBucketLimiter = void 0;
class TokenBucketLimiter {
    constructor(capacity, refillRatePerSecond, store) {
        this.capacity = capacity;
        this.refillRatePerSecond = refillRatePerSecond;
        this.store = store;
    }
    async isAllowed(identifier) {
        return await this.store.executeTokenBucket(identifier, this.capacity, this.refillRatePerSecond);
    }
}
exports.TokenBucketLimiter = TokenBucketLimiter;
