import { myCache } from "../app.js";
import { asyncHandler } from "../middlewares/error.js";




export const getDashboardStats = asyncHandler(async (req, res, next) => {

    let stats;
    const key = "admin-stats"

    if (myCache.has(key)) stats = JSON.parse(myCache.get(key) as string)

    else {
        const today = new Date()

        const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1)





    }

    return res.status(200).json({
        success: true,
        data: stats,
        message: "Stats fetched successfully"
    })




})


export const getPieCharts = asyncHandler(async (req, res, next) => { })

export const getBarCharts = asyncHandler(async (req, res, next) => { })

export const getLineCharts = asyncHandler(async (req, res, next) => { })
