import { NextFunction, Request, Response } from "express";



export type ControllerType<T = any> = (
    req: Request<any, any, T>, // T is the type of the request body
    res: Response,
    next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;


export type SearchRequestQuery = {
    search?: string;
    price?: string;
    category?: string;
    sort?: string;
    page?: string;
}

export interface BaseQuery {
    name?: {
        $regex: string,
        $options: string
    };
    price?: { $lte: number };
    category?: string;
}

export type InvalidateCacheProps = {
    product?: boolean;
    order?: boolean;
    admin?: boolean;
}