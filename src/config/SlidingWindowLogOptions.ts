import { RateLimitOptions } from "./RateLimitOptions";
import { RateLimitStrategyType } from "../types/RateLimitStrategyTypes";

export interface SlidingWindowLogOptions extends RateLimitOptions {
    strategy : "sliding-window-log",
    capacity : number,
    windowSizeMs : number,
}
