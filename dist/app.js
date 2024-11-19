import express from "express";
// Importing Routes
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
connectDB();
const app = express();
const port = 3000;
// process.env.PORT
app.use(express.json());
// Using Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.get("/", (req, res) => {
    res.send("API working with /api/v1");
});
app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(`express is working on http://localhost:${port}`);
});
