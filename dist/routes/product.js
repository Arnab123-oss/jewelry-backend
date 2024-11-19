import express from "express";
import { adminOnly } from "../middlewares/Auth.js";
import { deleteProdut, getAdminProducts, getAllcategories, getlatestProducts, getProdutsDetails, newProduct, updateProduct } from "../controller/product.js";
import { singleUpload } from "../middlewares/multer.js";
const app = express.Router();
app.post("/new", adminOnly, singleUpload, newProduct);
app.get("/latest", getlatestProducts);
app.get("/categories", getAllcategories);
app.get("/admin-products", getAdminProducts);
app.route("/:id").get()
    .get(getProdutsDetails)
    .put(singleUpload, updateProduct)
    .delete(deleteProdut);
export default app;
