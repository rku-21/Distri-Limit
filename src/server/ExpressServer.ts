import express from "express";

export class ExressServer {
    public readonly app=express();

    constructor (){
        this.configure();
    
    }
    private configure(){
        this.app.use(express.json());
    }

    public start(PORT:number){
        this.app.listen(PORT, ()=>{
            console.log(`server is listening on port ${PORT}`);
        })
    }


}