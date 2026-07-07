import dotenv from "dotenv";
import { preProcessFile } from "typescript";

dotenv.config();

export const env={
    PORT : Number(process.env.PORT),
    REDIS_HOST :process.env.REDIS_HOST,
    REDIS_PORT :Number(process.env.REDIS_PORT),
    TOKEN_BUCKET_CAPACITY :Number(process.env.TOKEN_BUCKET_CAPACITY),
    TOKEN_BUCKET_REFILL_RATE :Number(process.env.TOKEN_BUCKET_REFILL_RATE),
}