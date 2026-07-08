local key=KEYS[1];

local maxRequests=tonumber(ARGV[1]);
local windowSizeMs=tonumber(ARGV[2]);
local currentTime=tonumber(ARGV[3]);

local currentWindow=math.floor(currentTime/windowSizeMs);

local previusWindow=currentWindow-1;

local currnetWindowStart=currentWindow*windowSizeMs;
local elapsedTime=currentTime-currnetWindowStart;
local currentWindowWeight=elapsedTime/windowSizeMs;

--  reads counter 
local curentWindowRequestCount= tonumber(
    redis.call(
    "HGET",
    key,
    tostring(currentWindow)
)
) or 0;


local previousWindowRequestCount=tonumber(
    redis.call(
    "HGET",
    key,
    tostring(previusWindow)

    )
) or 0;


--- estimated count 

local estimatedCount=curentWindowRequestCount+previousWindowRequestCount * (1-currentWindowWeight);


--- process the requests (REJECT)

 if estimatedCount>= maxRequests then 
    local retryAfterMs=windowSizeMs-elapsedTime;

    return {0,retryAfterMs};
end

--- Allow
curentWindowRequestCount=curentWindowRequestCount+1;

redis.call(
    "HSET",
    key,
    tostring(currentWindow),
    curentWindowRequestCount
)

redis.call(
    "PEXPIRE",
    key,
    windowSizeMs*2
)

return {1,0};



