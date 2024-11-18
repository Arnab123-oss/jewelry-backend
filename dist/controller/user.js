import { User } from "../models/user.js";
import { asyncHandler } from "../middlewares/error.js";
export const createUser = asyncHandler(async (req, res, next) => {
    const userReq = req.body;
    let userdata = await User.findById(userReq._id);
    if (userdata) {
        res.status(200).json({
            success: `Welcome , ${userdata.name}`
        });
    }
    const user = await User.create(userReq);
    res.status(201).json({
        success: true,
        user: user,
        message: `Welcome, ${user.name}`
    });
});
