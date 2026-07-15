"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlidingWindowLogLimiter = void 0;
class SlidingWindowLogLimiter {
    constructor(maxRequests, windowSizeMs, Store) {
        this.maxRequests = maxRequests;
        this.windowSizeMs = windowSizeMs;
        this.Store = Store;
    }
    async isAllowed(identifier) {
        return await this.Store.executeSlidingWindow(identifier, this.maxRequests, this.windowSizeMs);
    }
}
exports.SlidingWindowLogLimiter = SlidingWindowLogLimiter;
