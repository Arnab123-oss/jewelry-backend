import express from "express";
import { createUser, deleteUser, getAllUsers, getUser } from "../controller/user.js";
import { adminOnly } from "../middlewares/Auth.js";



const app = express.Router();



app.post("/new", createUser);
app.get("/all", adminOnly, getAllUsers);

app.route("/:id").get(getUser).delete(adminOnly, deleteUser);

// app.get("/:id",getUser)
// app.delete("/:id",deleteUser);





export default app;