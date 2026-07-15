"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    PORT: Number(process.env.PORT),
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: Number(process.env.REDIS_PORT),
    TOKEN_BUCKET_CAPACITY: Number(process.env.TOKEN_BUCKET_CAPACITY),
    TOKEN_BUCKET_REFILL_RATE: Number(process.env.TOKEN_BUCKET_REFILL_RATE),
};
