import { NextFunction, Request, Response } from "express";



export type ControllerType<T = any> = (
    req: Request<any, any, T>, // T is the type of the request body
    res: Response,
    next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;