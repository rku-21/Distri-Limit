import { RateLimitOptions } from "./RateLimitOptions";
export interface FixedWindowOptions extends RateLimitOptions {
    strategy: "fixed-winodw";
    capacity: number;
    windowSizeMs: number;
}
