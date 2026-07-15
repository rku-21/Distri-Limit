"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeakyBucketLimiter = void 0;
class LeakyBucketLimiter {
    constructor(capacity, leakRatePerSecond, store) {
        this.capacity = capacity;
        this.leakRatePerSecond = leakRatePerSecond;
        this.store = store;
    }
    async isAllowed(identifier) {
        return this.store.executeLeakyBucket(identifier, this.capacity, this.leakRatePerSecond);
    }
}
exports.LeakyBucketLimiter = LeakyBucketLimiter;
