import express from "express";
import dotenv from "dotenv"
import { rateLimit } from "./createRateLimit";
import { MemoryStore } from "./store/MemoryStore";
import { RateLimiterStore } from "./store/RateLimiterStore";
import { RedisStore } from "./store/redisStore";


dotenv.config();

const app=express();

app.use(
  rateLimit({
    strategy: "token-bucket",
    capacity:5,
    refillRatePerSecond: 2,
    handler:(req,res,result)=>{
    return res.status(429).json({
        message:"thora dhire se",
        retryAfterMs:result.retryAfterMs,
        limit:result.limit,
        remaining:result.remaining
    })

  }



  }),
 
);

  app.get("/profile",(req,res)=>{
    res.send("here is you profile user ");
  })





app.listen(3000,()=>{
    console.log("server is listening to port 3000");
})


