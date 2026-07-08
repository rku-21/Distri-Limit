import express from "express";
import dotenv from "dotenv"
import { rateLimit } from "distrilimit";

dotenv.config();

export const app=express();

app.use(express.json());

app.use(rateLimit({
    strategy :"sliding-window-counter",
    capacity: 5,
    windowSizeMs:10000,
    redis : {
        host:process.env.REDIS_HOST!,
        port:Number(process.env.REDIS_PORT)!,
    }
}))

app.listen(3000, ()=>{
    console.log("server is listening it ",3000);
})

app.get("/profile",(req,res)=>{
    res.send("Here is your profile user ->>>");
})
