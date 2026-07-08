"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExressServer = void 0;
const express_1 = __importDefault(require("express"));
class ExressServer {
    constructor() {
        this.app = (0, express_1.default)();
        this.configure();
    }
    configure() {
        this.app.use(express_1.default.json());
    }
    start(PORT) {
        this.app.listen(PORT, () => {
            console.log(`server is listening on port ${PORT}`);
        });
    }
}
exports.ExressServer = ExressServer;
