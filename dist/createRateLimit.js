"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimit = rateLimit;
const strategyFactory_1 = require("./Factory/strategyFactory");
const RateLimitMiddleWare_1 = require("./middleware/RateLimitMiddleWare");
const MemoryStore_1 = require("./store/MemoryStore");
function rateLimit(options) {
    const store = options.store ?? new MemoryStore_1.MemoryStore();
    const strategy = strategyFactory_1.StrategyFactory.create(options, store);
    const rateLimitMiddleware = new RateLimitMiddleWare_1.RateLimitMiddleWare(strategy, options.keyGenerator, options.handler);
    return rateLimitMiddleware.handle;
}
