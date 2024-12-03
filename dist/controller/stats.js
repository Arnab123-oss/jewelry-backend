import { myCache } from "../app.js";
import { asyncHandler } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePrecentage, getChartData, getInventories } from "../utils/features.js";
export const getDashboardStats = asyncHandler(async (req, res, next) => {
    let stats;
    const key = "admin-stats";
    if (myCache.has(key))
        stats = JSON.parse(myCache.get(key));
    else {
        const today = new Date();
        const sixMonthAgo = new Date();
        sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);
        const thisMonth = {
            start: new Date(today.getFullYear(), today.getMonth(), 1),
            end: today
        };
        const lastMonth = {
            start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
            end: new Date(today.getFullYear(), today.getMonth(), 0)
        };
        const thisMonthProductsPromise = Product.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end
            }
        });
        const lastMonthProductsPromise = Product.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end
            }
        });
        const thisMonthUsersPromise = User.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end
            }
        });
        const lastMonthUsersPromise = User.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end
            }
        });
        const thisMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end
            }
        });
        const lastMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end
            }
        });
        const lastSixMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: sixMonthAgo,
                $lte: today
            }
        });
        const latestTransctionPromise = Order.find({})
            .select(["orderItems", "discount", "total", "status"])
            .limit(4);
        const [thisMonthProducts, thisMonthUsers, thisMonthOrders, lastMonthProducts, lastMonthUsers, lastMonthOrders, productsCount, usersCount, allOrders, lastSixMonthOrders, categories, femaleUsersCount, latestTransction] = await Promise.all([
            thisMonthProductsPromise,
            thisMonthUsersPromise,
            thisMonthOrdersPromise,
            lastMonthProductsPromise,
            lastMonthUsersPromise,
            lastMonthOrdersPromise,
            Product.countDocuments(),
            User.countDocuments(),
            Order.find({}).select("total"),
            lastSixMonthOrdersPromise,
            Product.distinct("category"),
            User.countDocuments({ gender: "female" }),
            latestTransctionPromise
        ]);
        const thisMonthRevenue = thisMonthOrders.reduce((total, order) => total + (order.total || 0), 0);
        const lastMonthRevenue = lastMonthOrders.reduce((total, order) => total + (order.total || 0), 0);
        const changePercent = {
            revenue: calculatePrecentage(thisMonthRevenue, lastMonthRevenue),
            product: calculatePrecentage(thisMonthProducts.length, lastMonthProducts.length),
            user: calculatePrecentage(thisMonthUsers.length, lastMonthUsers.length),
            order: calculatePrecentage(thisMonthOrders.length, lastMonthOrders.length)
        };
        const revenue = allOrders.reduce((total, order) => total + (order.total || 0), 0);
        const count = {
            revenue,
            user: usersCount,
            product: productsCount,
            order: allOrders.length
        };
        const orderMonthCounts = new Array(6).fill(0);
        const orderMonthRevenue = new Array(6).fill(0);
        lastSixMonthOrders.forEach((order) => {
            const creationDate = order.createdAt;
            const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
            if (monthDiff < 6) {
                orderMonthCounts[6 - monthDiff - 1] += 1;
                orderMonthRevenue[6 - monthDiff - 1] += order.total;
            }
        });
        const categoryCount = await getInventories({
            categories,
            productsCount
        });
        const userRatio = {
            male: usersCount - femaleUsersCount,
            female: femaleUsersCount,
        };
        const modifiedLatestTransaction = latestTransction.map((i) => ({
            _id: i._id,
            discount: i.discount,
            amount: i.total,
            quantity: i.orderItems.length,
            status: i.status
        }));
        stats = {
            categoryCount,
            changePercent,
            count,
            userRatio,
            latestTransction: modifiedLatestTransaction,
            chart: {
                order: orderMonthCounts,
                revenue: orderMonthRevenue
            }
        };
        myCache.set(key, JSON.stringify(stats));
    }
    return res.status(200).json({
        success: true,
        stats,
        message: "Stats fetched successfully"
    });
});
export const getPieCharts = asyncHandler(async (req, res, next) => {
    let charts;
    const key = "admin-pie-charts";
    if (myCache.has(key)) {
        charts = JSON.parse(myCache.get(key));
    }
    else {
        const [processingOrder, shippedOrder, deliveredOrder, categories, productsCount, productOutOfStock, allOrders, allUsers, adminUserCount, customerUserCount] = await Promise.all([
            Order.countDocuments({ status: "Processing" }),
            Order.countDocuments({ status: "Shipped" }),
            Order.countDocuments({ status: "Delivered" }),
            Product.distinct("category"),
            Product.countDocuments(),
            Product.countDocuments({ stock: 0 }),
            Order.find({}).select(["total", "discount", "subtotsl", "tax", "shippingCharges"]),
            User.find({}).select(["dob"]),
            User.countDocuments({ role: "admin" }),
            User.countDocuments({ role: "user" }),
        ]);
        const orderFulfilment = {
            processing: processingOrder,
            shipped: shippedOrder,
            delivered: deliveredOrder
        };
        const productCategories = await getInventories({
            categories,
            productsCount
        });
        const stockAvailablity = {
            inStock: productsCount - productOutOfStock,
            outOfStock: productOutOfStock
        };
        const grossIncome = allOrders.reduce((prev, order) => prev + (order.total || 0), 0);
        const discount = allOrders.reduce((prev, order) => prev + (order.discount || 0), 0);
        const productionCost = allOrders.reduce((prev, order) => prev + (order.shippingCharges || 0), 0);
        const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);
        const marketingCost = Math.round(grossIncome * (30 / 100));
        const netMargin = grossIncome - discount - productionCost - burnt - marketingCost;
        const revenueDistribution = {
            netMargin,
            discount,
            productionCost,
            burnt,
            marketingCost
        };
        const usersAgeGroup = {
            ten: allUsers.filter((user) => user.age < 20).length,
            adult: allUsers.filter((user) => user.age >= 20 && user.age < 40).length,
            old: allUsers.filter((user) => user.age >= 40).length,
        };
        const adminCustomer = {
            admin: adminUserCount,
            customer: customerUserCount
        };
        charts = {
            orderFulfilment,
            productCategories,
            stockAvailablity,
            revenueDistribution,
            adminCustomer,
            usersAgeGroup
        };
        myCache.set(key, JSON.stringify(charts));
    }
    return res.status(200).json({
        success: true,
        charts,
        message: "Stats fetched successfully"
    });
});
export const getBarCharts = asyncHandler(async (req, res, next) => {
    let charts;
    const key = "admin-bar-charts";
    if (myCache.has(key)) {
        charts = JSON.parse(myCache.get(key));
    }
    else {
        const today = new Date();
        const sixMonthAgo = new Date();
        sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);
        const twelveMonthAgo = new Date();
        twelveMonthAgo.setMonth(twelveMonthAgo.getMonth() - 12);
        const lastSixMonthProductsPromise = Product.find({
            createdAt: {
                $gte: sixMonthAgo,
                $lte: today
            }
        }).select("createdAt");
        const lastSixMonthUsersPromise = User.find({
            createdAt: {
                $gte: sixMonthAgo,
                $lte: today
            }
        }).select("createdAt");
        const lastTwelveMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: twelveMonthAgo,
                $lte: today
            }
        }).select("createdAt");
        const [products, users, orders] = await Promise.all([
            lastSixMonthProductsPromise,
            lastSixMonthUsersPromise,
            lastTwelveMonthOrdersPromise
        ]);
        const productCounts = getChartData({ length: 6, today, docArr: products });
        const usersCounts = getChartData({ length: 6, today, docArr: users });
        const ordersCounts = getChartData({ length: 12, today, docArr: orders });
        charts = {
            products: productCounts,
            users: usersCounts,
            orders: ordersCounts
        };
        myCache.set(key, JSON.stringify(charts));
    }
    return res.status(200).json({
        success: true,
        charts,
        message: "Stats fetched successfully"
    });
});
export const getLineCharts = asyncHandler(async (req, res, next) => {
    let charts;
    const key = "admin-line-charts";
    if (myCache.has(key)) {
        charts = JSON.parse(myCache.get(key));
    }
    else {
        const today = new Date();
        const twelveMonthAgo = new Date();
        twelveMonthAgo.setMonth(twelveMonthAgo.getMonth() - 12);
        const baseQuery = {
            createdAt: {
                $gte: twelveMonthAgo,
                $lte: today
            }
        };
        const [products, users, orders] = await Promise.all([
            Product.find(baseQuery).select("createdAt"),
            User.find(baseQuery).select("createdAt"),
            Order.find(baseQuery).select(["createdAt", "discount", "total"])
        ]);
        const productCounts = getChartData({ length: 12, today, docArr: products });
        const usersCounts = getChartData({ length: 12, today, docArr: users });
        const discount = getChartData({ length: 12, today, docArr: orders, property: "discount" });
        const revenue = getChartData({ length: 12, today, docArr: orders, property: "total" });
        charts = {
            products: productCounts,
            users: usersCounts,
            discount,
            revenue
        };
        myCache.set(key, JSON.stringify(charts));
    }
    return res.status(200).json({
        success: true,
        charts,
        message: "Stats fetched successfully"
    });
});
