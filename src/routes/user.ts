import  express  from "express";
import {createUser}  from "../controller/user.js";



const route = express.Router();



route.post("/new",createUser);






export default route;