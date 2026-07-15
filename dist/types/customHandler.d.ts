import { Request, Response } from "express";
import { RateLimitResult } from "../Interfaces/rateLimitResult";
export type handler = (req: Request, res: Response, result: RateLimitResult) => void;
