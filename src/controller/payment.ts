import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js"
import { Coupontype } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";



export const newCoupon = asyncHandler(async (req: Request<Coupontype>, res: Response, next: NextFunction) => {

    const { coupon, amount } = req.body;


    if (!coupon || !amount) next(new ErrorHandler("Please provide a coupon and Amount", 400))

    const newCoupon = await Coupon.create({
        code: coupon,
        amount
    });




    res.status(201).json({
        success: true,
        message: `Coupon ${newCoupon.code} created successfully`,

    })

})

export const applyDiscount = asyncHandler(async (req, res, next) => {

    const { coupon } = req.query;

    const discount = await Coupon.findOne({ code: coupon })



    if (!discount) return next(new ErrorHandler("Invalid Coupon Code", 400))


    res.status(200).json({
        success: true,
       discount: discount?.amount,

    })

})


export const allCoupons = asyncHandler(async (req, res, next) => {


    const coupons = await Coupon.find({})


    res.status(200).json({
        success: true,
        coupons,

    })

})


export const deleteCoupon = asyncHandler(async (req, res, next) => {

    const { id } = req.params

    const coupon = await Coupon.findByIdAndDelete(id)
    if (!coupon) return next(new ErrorHandler("Invalid Coupon ID", 400))

    res.status(200).json({
        success: true,
        message: `Coupon ${coupon?.code} deleted successfully`, 

    })

})