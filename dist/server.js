"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const createRateLimit_1 = require("./createRateLimit");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, createRateLimit_1.rateLimit)({
    strategy: "token-bucket",
    capacity: 5,
    refillRatePerSecond: 2,
    handler: (req, res, result) => {
        return res.status(429).json({
            message: "thora dhire se",
            retryAfterMs: result.retryAfterMs,
            limit: result.limit,
            remaining: result.remaining
        });
    }
}));
app.get("/profile", (req, res) => {
    res.send("here is you profile user ");
});
app.listen(3000, () => {
    console.log("server is listening to port 3000");
});
