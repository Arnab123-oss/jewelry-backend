import express from "express";
import { newOrder } from "../controller/order.js";
const app = express.Router();
app.post("/new", newOrder);
export default app;
