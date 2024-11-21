import mongoose from "mongoose";
import { InvalidateCacheProps } from "../types/types.js";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";

export const connectDB = (uri:string) => {
    mongoose.connect(uri, { dbName: "Ecommerce_24", })
        .then(c => console.log(`DB Connected to ${c.connection.host}`))
        .catch(e => (console.log(e)))
};


export const invalidatesCache = async ({ product, order, admin }: InvalidateCacheProps) => {

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

    }
    if (admin) {

    }

}