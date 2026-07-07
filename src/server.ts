import express from "express";
import {rateLimit} from "../src"

const app=express();

app.use(express.json());


app.use(rateLimit({
    strategy : "token-bucket",
    capacity:5,
    refillRatePerSecond : 1,
    redis :{
        host : "localhost",
        port : 6379
    }
}));

app.listen(3000, ()=>{
    console.log("server is listening it ",3000);
})

app.get("/profile",(req,res)=>{
    res.send("Here is your profile user ->>>");
})
