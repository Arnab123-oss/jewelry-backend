import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { ControllerType } from "../types/types.js";
import { Document,SchemaTimestampsConfig } from "mongoose";

export const errorMiddleware = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    
    // err.message = err.message || theb last line is the modifying version of this line "
    err.message ||=""
    err.statusCode ||=500


    
    res.status(404).json({
        status: false,
        message: err.message
    })
}


export const asyncHandler = <T>(func: ControllerType<T>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(func(req, res, next)).catch(next);
    };
};