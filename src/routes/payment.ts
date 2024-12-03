import express from "express";
import { adminOnly } from "../middlewares/Auth.js";
import { allCoupons, applyDiscount, createPaymentIntent, deleteCoupon, newCoupon } from "../controller/payment.js";



const app = express.Router();


app.post("/create", createPaymentIntent);

app.get("/discount", applyDiscount);

app.post("/coupon/new",adminOnly, newCoupon);

app.get("/coupon/all",adminOnly, allCoupons);

app.delete("/coupon/:id",adminOnly, deleteCoupon);



export default app;