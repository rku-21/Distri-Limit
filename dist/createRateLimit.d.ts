import { RateLimiterOptions } from "./config/RateLimitOptions";
export declare function rateLimit(options: RateLimiterOptions): (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void>;
