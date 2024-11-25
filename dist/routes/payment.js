import express from "express";
import { allCoupons, applyDiscount, deleteCoupon, newCoupon } from "../controller/payment.js";
const app = express.Router();
app.post("/coupon/new", newCoupon);
app.get("/discount", applyDiscount);
app.get("/coupon/all", allCoupons);
app.delete("/coupon/:id", deleteCoupon);
export default app;
