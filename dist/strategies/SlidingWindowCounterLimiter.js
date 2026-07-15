"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlidingWindowCounter = void 0;
class SlidingWindowCounter {
    constructor(maxRequests, windowSizeMs, store) {
        this.maxRequests = maxRequests;
        this.windowSizeMs = windowSizeMs;
        this.store = store;
    }
    async isAllowed(identifier) {
        return await this.store.executeSlidingWindowCounter(identifier, this.maxRequests, this.windowSizeMs);
    }
}
exports.SlidingWindowCounter = SlidingWindowCounter;
