import { asyncHandler } from "../middlewares/error.js";
import { Order } from "../models/order.js";
export const newOrder = asyncHandler(async (req, res, next) => {
    const { shippingInfo, user, subtotal, tax, shippingCharges, discount, total, orderItems, } = req.body;
    await Order.create({
        shippingInfo, user, subtotal, tax, shippingCharges, discount, total, orderItems,
    });
});
