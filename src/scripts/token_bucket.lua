local key=KEYS[1];

local capacity=tonumber(ARGV[1]);
local refillRate=tonumber(ARGV[2]);
local currentTime=tonumber(ARGV[3]);
local ttlMs=60000;

if refillRate > 0 then
    ttlMs=math.max(60000, math.ceil((capacity/refillRate)*2000));
end

--  Get the bucket 

local bucket=redis.call(
    "HMGET",
    key,
    "tokens",
    "lastRefill"
)

local tokens
local lastRefill

if not bucket[1] or not bucket[2] then 
    tokens=capacity
    lastRefill=currentTime

else 
    tokens=tonumber(bucket[1]) or capacity
    lastRefill=tonumber(bucket[2]) or currentTime
end

local elapsed=(currentTime-lastRefill)/1000;
local earnedTokens=elapsed*refillRate;

tokens=math.min(capacity,tokens+earnedTokens);
lastRefill=currentTime;

if tokens>=1 then 
    tokens=tokens-1;

    redis.call(
        "HSET",
        key,
        "tokens",
        tokens,
        "lastRefill",
        lastRefill
    )

    redis.call(
        "PEXPIRE",
        key,
        ttlMs
    )
    return {1,0,capacity,tokens}
end

local missingTokens=1-tokens;

local retryAfterMs=math.ceil((missingTokens/refillRate)*1000);

redis.call(
    "PEXPIRE",
    key,
    ttlMs
)

return {0,retryAfterMs,capacity,0};



