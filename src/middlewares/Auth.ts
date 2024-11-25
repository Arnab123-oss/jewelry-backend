import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { asyncHandler } from "./error.js";


//middleware to make sure only admin is allowed
export const adminOnly = asyncHandler(async (req, res, next) => {

const {id} = req.query;
if(!id) return next(new ErrorHandler("LogIn Please",401));

const user = await User.findById(id);
if(!user) return next(new ErrorHandler("User not found",401));
if(user.role!== "admin") return next(new ErrorHandler(user.name+"is not a Admin",403));

next();

})