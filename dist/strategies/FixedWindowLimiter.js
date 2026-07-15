"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedWindowLimiter = void 0;
class FixedWindowLimiter {
    constructor(maxRequests, windowSizeMs, store) {
        this.maxRequests = maxRequests;
        this.windowSizeMs = windowSizeMs;
        this.store = store;
    }
    async isAllowed(identifier) {
        return this.store.executeFixedWindow(identifier, this.maxRequests, this.windowSizeMs);
    }
}
exports.FixedWindowLimiter = FixedWindowLimiter;
