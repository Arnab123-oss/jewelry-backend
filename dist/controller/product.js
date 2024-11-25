import { asyncHandler } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidatesCache } from "../utils/features.js";
export const newProduct = asyncHandler(async (req, res, next) => {
    const { name, category, price, stock } = req.body;
    const photo = req.file;
    // as Express.Multer.File;
    if (!photo)
        next(new ErrorHandler("please provide a photo", 400));
    if (!name || !price || !category || !stock) {
        photo?.path && rm(photo.path, () => {
            console.log("Deleted");
        });
        return next(new ErrorHandler("please enter all fields", 400));
    }
    await Product.create({
        name,
        category: category.toLowerCase(),
        price,
        stock,
        photo: photo?.path,
    });
    await invalidatesCache({ product: true });
    return res.status(200).json({
        success: true,
        message: "Product created successfully",
    });
});
//Revalidate on New,Update,Delete product & on New Order
export const getlatestProducts = asyncHandler(async (req, res, next) => {
    let products;
    if (myCache.has("latest_products")) {
        products = JSON.parse(myCache.get("latest_products"));
    }
    else {
        products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
        myCache.set("latest_products", JSON.stringify(products));
    }
    return res.status(201).json({
        success: true,
        products,
    });
});
//Revalidate on New,Update,Delete product & on New Order
export const getAllcategories = asyncHandler(async (req, res, next) => {
    let categories;
    if (myCache.has("All_Categories")) {
        categories = JSON.parse(myCache.get("All_Categories"));
    }
    else {
        categories = await Product.distinct("category");
        myCache.set("All_Categories", JSON.stringify(categories));
    }
    return res.status(201).json({
        success: true,
        categories,
    });
});
//Revalidate on New,Update,Delete product & on New Order
export const getAdminProducts = asyncHandler(async (req, res, next) => {
    let allProducts;
    if (myCache.has("All_Products")) {
        allProducts = JSON.parse(myCache.get("All_Products"));
    }
    else {
        allProducts = await Product.find({});
        myCache.set("All_Products", JSON.stringify(allProducts));
    }
    return res.status(201).json({
        success: true,
        allProducts,
    });
});
export const getProdutsDetails = asyncHandler(async (req, res, next) => {
    let product;
    const id = req.params.id;
    if (myCache.has(`Single_Product_${id}`)) {
        product = JSON.parse(myCache.get(`Single_Product_${id}`));
    }
    else {
        product = await Product.findById(id);
        if (!product)
            return next(new ErrorHandler("Product Not Found", 404));
        myCache.set(`Single_Product_${id}`, JSON.stringify(product));
    }
    return res.status(201).json({
        success: true,
        product,
    });
});
export const updateProduct = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const { name, category, price, stock } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);
    if (!product)
        next(new ErrorHandler("Invalid Product Id ", 404));
    if (photo) {
        rm(product.photo, () => {
            console.log("Old photo Deleted");
        });
        product.photo = photo.path;
    }
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category.toLowerCase();
    await product.save();
    await invalidatesCache({
        product: true,
        productId: String(product?._id)
    });
    return res.status(200).json({
        success: true,
        message: "Product Updated successfully",
    });
});
export const deleteProdut = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product)
        next(new ErrorHandler("Product not found", 404));
    rm(product.photo, () => {
        console.log("Product Photo Deleted");
    });
    await product?.deleteOne();
    await invalidatesCache({
        product: true,
        productId: String(product?._id)
    });
    return res.status(201).json({
        success: true,
        message: "Product Deleted successfully",
    });
});
export const getAllProducts = asyncHandler(async (req, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;
    const baseQuery = {};
    // category,
    if (search) {
        baseQuery.name = {
            $regex: typeof search === "string" ? search : "",
            $options: "i",
        };
    }
    if (price) {
        baseQuery.price = {
            $lte: Number(price)
        };
    }
    if (category && typeof category === "string")
        baseQuery.category = category;
    const [products, filteredOnlyProduct] = await Promise.all([
        Product.find(baseQuery)
            .sort(sort && { price: sort === "asc" ? 1 : -1 })
            .limit(limit)
            .skip(skip),
        Product.find(baseQuery)
    ]);
    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);
    return res.status(201).json({
        success: true,
        products,
        totalPage
    });
});
