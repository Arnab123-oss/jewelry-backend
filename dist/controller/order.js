import { asyncHandler } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { invalidatesCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";
export const newOrder = asyncHandler(async (req, res, next) => {
    const { shippingInfo, user, subtotal, tax, shippingCharges, discount, total, orderItems, } = req.body;
    if (!shippingInfo || !orderItems || !user || !subtotal || !tax || !total)
        return next(new ErrorHandler("Please Enter All Fields", 400));
    const order = await Order.create({
        shippingInfo,
        user,
        subtotal,
        tax,
        shippingCharges,
        discount,
        total,
        orderItems,
    });
    await reduceStock(orderItems);
    invalidatesCache({
        product: true,
        order: true,
        admin: true,
        userId: user,
        productId: order.orderItems.map((i) => String(i.productId)),
    });
    return res.status(201).json({
        success: true,
        message: "Order placed successfully"
    });
});
export const myOrders = asyncHandler(async (req, res, next) => {
    const { id } = req.query;
    let orders = [];
    if (myCache.has(`my-orders-${id}`))
        orders = JSON.parse(myCache.get(`my-orders-${id}`));
    else {
        orders = await Order.find({ user: id });
        myCache.set(`my-orders-${id}`, JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        orders,
    });
});
export const allOrders = asyncHandler(async (req, res, next) => {
    let orders = [];
    if (myCache.has("all-orders"))
        orders = JSON.parse(myCache.get("all-orders"));
    else {
        orders = await Order.find().populate("user", "name");
        myCache.set("all-orders", JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        orders,
    });
});
export const getOrderDetails = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const key = `order-${id}`;
    let order;
    if (myCache.has(key))
        order = JSON.parse(myCache.get(key));
    else {
        order = await Order.findById(id).populate("user", "name");
        if (!order)
            return next(new ErrorHandler("Order Not Found", 404));
        myCache.set(key, JSON.stringify(order));
    }
    return res.status(200).json({
        success: true,
        order,
    });
});
export const processOrder = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order)
        return next(new ErrorHandler("Order Not Found", 404));
    switch (order.status) {
        case "Processing":
            order.status = "Shipped";
            break;
        case "Shipped":
            order.status = "Delivered";
            break;
        default:
            order.status = "Delivered";
            break;
    }
    await order.save();
    invalidatesCache({
        product: false,
        order: true,
        admin: true,
        userId: order.user,
        orderId: String(order._id),
    });
    return res.status(200).json({
        success: true,
        message: `Order ${order.status} successfully`
    });
});
export const deleteOrder = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order)
        return next(new ErrorHandler("Order Not Found", 404));
    await order.deleteOne();
    invalidatesCache({
        product: false,
        order: true,
        admin: true,
        userId: order.user,
        orderId: String(order._id),
    });
    return res.status(200).json({
        success: true,
        message: "Order deleted successfully"
    });
});
