"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimit = rateLimit;
const strategyFactory_1 = require("./Factory/strategyFactory");
const RateLimitMiddleWare_1 = require("./middleware/RateLimitMiddleWare");
const redisStore_1 = require("./store/redisStore");
function rateLimit(options) {
    const store = new redisStore_1.RedisStore(options.redis.host, options.redis.port);
    const strategy = strategyFactory_1.StrategyFactory.create(options, store);
    const rateLimitMiddleware = new RateLimitMiddleWare_1.RateLimitMiddleWare(strategy);
    return rateLimitMiddleware.handle;
}
