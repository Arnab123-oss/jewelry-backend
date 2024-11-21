import { Request } from "express";
import { asyncHandler } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";


export const newOrder = asyncHandler(async (req: Request<NewOrderRequestBody>, res, next) => {


    const { shippingInfo, user, subtotal, tax, shippingCharges, discount, total, orderItems, } = req.body

    await Order.create({
         shippingInfo, user, subtotal, tax, shippingCharges, discount, total, orderItems, })


})