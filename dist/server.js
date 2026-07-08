"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const distrilimit_1 = require("distrilimit");
dotenv_1.default.config();
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, distrilimit_1.rateLimit)({
    strategy: "sliding-window-counter",
    capacity: 5,
    windowSizeMs: 10000,
    redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    }
}));
exports.app.listen(3000, () => {
    console.log("server is listening it ", 3000);
});
exports.app.get("/profile", (req, res) => {
    res.send("Here is your profile user ->>>");
});
