import express from "express";

import { adminOnly } from "../middlewares/Auth.js";
import { deleteProdut, getAdminProducts, getAllcategories, getAllProducts, getlatestProducts, getProdutsDetails, newProduct, updateProduct } from "../controller/product.js";
import { singleUpload } from "../middlewares/multer.js";



const app = express.Router();

app.post("/new",adminOnly,singleUpload,newProduct)

app.get("/latest",getlatestProducts)

app.get("/all",getAllProducts)

app.get("/categories",getAllcategories)

app.get("/admin-products",adminOnly,getAdminProducts)

app.route("/:id").get()
.get(getProdutsDetails)
.put(adminOnly,singleUpload,updateProduct)
.delete(adminOnly,deleteProdut);









export default app;