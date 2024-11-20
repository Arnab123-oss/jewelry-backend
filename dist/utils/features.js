import mongoose from "mongoose";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
export const connectDB = () => {
    mongoose.connect("mongodb://localhost:27017/", { dbName: "Ecommerce_24", })
        .then(c => console.log(`DB Connected to ${c.connection.host}`))
        .catch(e => (console.log(e)));
};
export const invalidatesCache = async ({ product, order, admin }) => {
    if (product) {
        const productKeys = [
            "latest_products",
            "All_Categories",
            "All_Products"
        ];
        // `Single_Product_${id}`
        const products = await Product.find({}).select("_id");
        products.forEach(i => {
            productKeys.push(`Single_Product_${i._id}`);
        });
        myCache.del(productKeys);
    }
    if (order) {
    }
    if (admin) {
    }
};
