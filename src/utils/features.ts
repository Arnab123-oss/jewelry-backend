import mongoose from "mongoose";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { Order } from "../models/order.js";

export const connectDB = (uri: string) => {
    mongoose.connect(uri, { dbName: "Ecommerce_24", })
        .then(c => console.log(`DB Connected to ${c.connection.host}`))
        .catch(e => (console.log(e)))
};


export const invalidatesCache = async ({
    product,
    order,
    admin,
    userId,
    orderId }: InvalidateCacheProps) => {

    if (product) {
        const productKeys: string[] = [
            "latest_products",
            "All_Categories",
            "All_Products"
        ];

        // `Single_Product_${id}`

        const products = await Product.find({}).select("_id")

        products.forEach(i => {
            productKeys.push(`Single_Product_${i._id}`);
        });


        myCache.del(productKeys)
    }
    if (order) {
        const orderKeys: string[] = ["all-orders", `my-orders-${userId}`,`order-${orderId}`];

        myCache.del(orderKeys)
    }
    if (admin) {

    }

}

export const reduceStock = async (orderItems: OrderItemType[]) => {

    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId)

        if (!product) {
            throw new Error("Product not found")
        }

        product.stock -= order.quantity

        await product.save()
    }

}