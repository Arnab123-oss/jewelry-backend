import express from "express";
import { adminOnly } from "../middlewares/Auth.js";
import { allOrders, deleteOrder, getOrderDetails, myOrders, newOrder, processOrder } from "../controller/order.js";
const app = express.Router();
app.post("/new", newOrder);
app.get("/my-orders", myOrders);
app.get("/all-orders", adminOnly, allOrders);
app.route("/:id")
    .get(getOrderDetails)
    .put(adminOnly, processOrder)
    .delete(adminOnly, deleteOrder);
export default app;
