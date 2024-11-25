import express from "express";
import { createUser, deleteUser, getAllUsers, getUser } from "../controller/user.js";
import { adminOnly } from "../middlewares/Auth.js";
import { getBarCharts, getDashboardStats, getLineCharts, getPieCharts } from "../controller/stats.js";



const app = express.Router();



app.get("/stats", adminOnly, getDashboardStats);


app.get("/pie", adminOnly, getPieCharts);


app.get("/bar", adminOnly, getBarCharts);

app.get("/line", adminOnly, getLineCharts);





export default app;