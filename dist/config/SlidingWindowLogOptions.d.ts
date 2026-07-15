import { RateLimitOptions } from "./RateLimitOptions";
export interface SlidingWindowLogOptions extends RateLimitOptions {
    strategy: "sliding-window-log";
    capacity: number;
    windowSizeMs: number;
}
