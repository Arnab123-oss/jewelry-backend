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
    userId?: string;
    orderId?: string;
    productId?: string | string[];
}
export type OrderItemType = {
    name: string,
    photo: string,
    price: number,
    quantity: number,
    productId: string
}

export type ShippingInfoType = {
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: number
}


export interface NewOrderRequestBody {
    shippingInfo: ShippingInfoType;
    user: string;
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    orderItems: OrderItemType[]
}


export type Coupontype = {
    coupon: string;
    amount: number;
}