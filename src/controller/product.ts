import { asyncHandler } from "../middlewares/error.js"
import { Product } from "../models/product.js"
import { ProductRequestBody } from "../DTO/IUserDTO.js";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";



export const newProduct = asyncHandler(async (
    req: Request<ProductRequestBody>,
    res: Response,
    next: NextFunction) => {

    const { name, category, price, stock } = req.body;

    const photo = req.file
    // as Express.Multer.File;
    if (!photo) next(new ErrorHandler("please provide a photo", 400))


    if (!name || !price || !category || !stock) {
        photo?.path && rm(photo.path, () => {
            console.log("Deleted")
        })

        return next(new ErrorHandler("please enter all fields", 400))
    }
    await Product.create({
        name,
        category: category.toLowerCase(),
        price,
        stock,
        photo: photo?.path,
    });


    return res.status(201).json({
        success: true,
        message: "Product created successfully",

    });
})

export const getlatestProducts = asyncHandler(async (req, res, next) => {

    const products = await Product.find({}).sort({ createdAt: -1 }).limit(5)

    return res.status(201).json({
        success: true,
        products,

    });
})

export const getAllcategories = asyncHandler(async (req, res, next) => {

    const categories = await Product.distinct("category");

    return res.status(201).json({
        success: true,
        categories,

    });
})


export const getAdminProducts = asyncHandler(async (req, res, next) => {

    const products = await Product.find({})
    return res.status(201).json({
        success: true,
        products,

    });
})


export const getProdutsDetails = asyncHandler(async (req, res, next) => {

    const product = await Product.findById(req.params.id)
    return res.status(201).json({
        success: true,
        product,

    });
})


export const updateProduct = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction) => {

    const id = req.params.id
    const { name, category, price, stock } = req.body;
    const photo = req.file
    const product = await Product.findById(id);

    if (!product) next(new ErrorHandler("Invalid Product Id ", 404))


    if (photo) {
        rm(product!.photo, () => {
            console.log("Old photo Deleted")
        })

        product!.photo = photo.path
    }

    if (name) product!.name = name
    if (price) product!.price = price
    if (stock) product!.stock = stock
    if (category) product!.category = category.toLowerCase();

await product!.save()

    return res.status(200).json({
        success: true,
        message: "Product Updated successfully",

    });
})


export const deleteProdut = asyncHandler(async (req, res, next) => {

    const product = await Product.findById(req.params.id)

    if (!product) next(new ErrorHandler("Product not found", 404))

        rm(product!.photo, () => {
            console.log("Product Photo Deleted")
        })

    await product?.deleteOne()

    return res.status(201).json({
        success: true,
        message: "Product Deleted successfully",

    });
})




