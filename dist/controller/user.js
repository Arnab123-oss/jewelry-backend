import { User } from "../models/user.js";
import { asyncHandler } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";
export const createUser = asyncHandler(async (req, res, next) => {
    const userReq = req.body;
    let userdata = await User.findById(userReq._id);
    if (userdata) {
        res.status(200).json({
            success: true,
            message: `Welcome , ${userdata.name}`
        });
    }
    if (!userReq._id || !userReq.name || !userReq.email || !userReq.photo || !userReq.gender || !userReq.dob) {
        return next(new ErrorHandler("Please add all fields", 400));
    }
    const user = await User.create(userReq);
    res.status(201).json({
        success: true,
        user: user,
        message: `Welcome, ${user.name}`
    });
});
export const getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find({});
    return res.status(200).json({
        success: true,
        users
    });
});
export const getUser = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler("Invalid Id", 400));
    }
    return res.status(200).json({
        success: true,
        user
    });
});
export const deleteUser = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler("Invalid Id", 400));
    }
    await user.deleteOne();
    return res.status(200).json({
        success: true,
        message: "user deleted successfully"
    });
});
