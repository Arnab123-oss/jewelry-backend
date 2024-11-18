import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { UserRequestBody } from "../DTO/IUserDTO.js";
import { IUser } from "../interface/IUser.js";
import { asyncHandler } from "../middlewares/error.js";



export const createUser = asyncHandler(
    async (
        req: Request<UserRequestBody>,
        res: Response,
        next: NextFunction): Promise<void> => {

        const userReq: IUser = req.body;

        let userdata = await User.findById(userReq._id)

        if (userdata) {
             res.status(200).json({
                success: `Welcome , ${userdata.name}`

            })
        }
        const user = await User.create(userReq)

        res.status(201).json({
            success: true,
            user: user,
            message: `Welcome, ${user.name}`
        });

    })

