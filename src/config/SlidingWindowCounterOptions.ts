
import { RateLimitStrategyType } from "../types/RateLimitStrategyTypes";
import { RateLimitOptions } from "./RateLimitOptions";

export interface SlidingWindowCounterOptions extends RateLimitOptions {
    strategy : "sliding-window-counter",
    capacity : number,
    windowSizeMs :number,
    
}