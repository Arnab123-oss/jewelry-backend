import mongoose, { Document } from "mongoose";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import { Order } from "../models/order.js";

export const connectDB = (uri: string) => {
    mongoose.connect(uri, { dbName: "Ecommerce_24", })
        .then(c => console.log(`DB Connected to ${c.connection.host}`))
        .catch(e => (console.log(e)))
};


export const invalidatesCache =  ({
    product,
    order,
    admin,
    userId,
    orderId,
    productId }: InvalidateCacheProps) => {

    if (product) {
        const productKeys: string[] = [
            "latest_products",
            "All_Categories",
            "All_Products",

        ];

        if (typeof productId === "string") { productKeys.push(`Single_Product_${productId}`) }

        if (typeof productId === "object") { productId.forEach((i) => productKeys.push(`Single_Product_${i}`)) }


        myCache.del(productKeys)
    }
    if (order) {
        const orderKeys: string[] = ["all-orders", `my-orders-${userId}`, `order-${orderId}`];

        myCache.del(orderKeys)
    }
    if (admin) {
        myCache.del([
            "admin-stats",
            "admin-pie-charts",
            "admin-bar-charts",
            "admin-line-charts"
        ]);
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



export const calculatePrecentage = (thisMonth: number, lastMonth: number) => {

    if (lastMonth === 0) return thisMonth * 100;


    const percent = (thisMonth - lastMonth) * 100
    return Number(percent.toFixed(0))
}


export const getInventories = async ({ categories, productsCount }:
    {
        categories: string[],
        productsCount: number
    }) => {
    const categoriesCountPromise = categories.map((category) => Product.countDocuments({ category }))

    const categoriesCount = await Promise.all(categoriesCountPromise);

    const categoryCount: Record<string, number>[] = []

    categories.forEach((category, i) => {
        categoryCount.push({
            [category]: Math.round((categoriesCount[i] / productsCount) * 100),
        })
    })

    return categoryCount;
}

export interface MyDocument extends Document {

    createdAt: Date;
    discount?: number;
    total?: number
}

type FuncProps = {
    length: number,
    docArr: MyDocument[],
    today: Date,
    property?: "discount" | "total",
}

export const getChartData = ({ length, docArr, today, property }: FuncProps) => {
    const data: number[] = new Array(length).fill(0);
    // console.log(length, docArr, today);

    docArr.forEach((i) => {
        const creationDate = i.createdAt;
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
        // console.log(monthDiff)
        if (monthDiff < length) {

            data[length - monthDiff - 1] += property ? i[property]! : 1

        }
    })
    return data;
}