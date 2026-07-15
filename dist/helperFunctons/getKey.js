"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKey = void 0;
const getKey = (identifier, strategy) => {
    if (strategy === "token-bucket") {
        return `token-bucket:${identifier}`;
    }
    else if (strategy === "leaky-bucket") {
        return `leaky-bucket:${identifier}`;
    }
    else if (strategy === "sliding-window-log") {
        return `sliding-window-log:${identifier}`;
    }
    else if (strategy === "sliding-window-counter") {
        return `sliding-window-counter:${identifier}`;
    }
    else if (strategy === "fixed-window") {
        return `fixed-window:${identifier}`;
    }
    else {
        return `default:${identifier}`;
    }
};
exports.getKey = getKey;
