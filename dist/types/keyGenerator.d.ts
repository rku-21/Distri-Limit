import { Request } from "express";
export type keyGenerator = (req: Request) => string;
