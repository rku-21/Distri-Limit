export interface RateLimitOptions {
    strategy: "token-bucket",
    capacity : number,
    refillRatePerSecond: number,

    redis : {
        host: string,
        port :number,
    }
}