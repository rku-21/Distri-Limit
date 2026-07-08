local key=KEYS[1];

local capacity=tonumber(ARGV[1]);
local refillRate=tonumber(ARGV[2]);
local currentTime=tonumber(ARGV[3]);

--  Get the bucket 

local bucket=redis.call(
    "HMGET",
    key,
    "tokens",
    "lastRefill"
)

local tokens
local lastRefill

if bucket[1]==false then 
    tokens=capacity
    lastRefill=currentTime

else 
    tokens=tonumber(bucket[1])
    lastRefill=tonumber(bucket[2])
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
    return {1,0}
end

local missingTokens=1-tokens;

local retryAfterMs=math.ceil((missingTokens/refillRate)*1000);

return {0,retryAfterMs};



